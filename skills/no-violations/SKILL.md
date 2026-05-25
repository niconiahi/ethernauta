---
name: no-violations
description: Absolute rules — no `as` type assertions, no redundant `:` annotations, no `@ts-*` / `biome-ignore` / `eslint-disable`, no per-path or per-rule exemptions in biome.json. Read before writing any line of TypeScript in this monorepo. Sits in front of every other skill; if any guidance below conflicts with another skill, this skill wins.
---

# No casts, no redundant annotations, no ignores

This skill is the codification of the cleanup that ran across the repo
in 2026-05. Its rules are absolute. There are no "this one is fine"
exceptions — that's what got the codebase here in the first place.

Enforced mechanically by `scripts/no-escape-hatches.sh` against
`scripts/no-escape-hatches.baseline.json`. Any change that makes a
baseline number go UP fails the check.

## R0 — Boundaries validate, interiors infer

This is the principle every other rule is derived from. Internalise it
before reading R1–R5.

A value enters the system at some boundary: a function parameter, a
JSON-RPC envelope, a `postMessage` payload, an HTTP response, a file
read, a user-supplied DOM event. **At that boundary, validate with
Valibot.** From that point on, TypeScript already knows exactly what
the value is — because the validated shape's type is
`InferOutput<typeof xSchema>`. **Inside the boundary, do not retype,
do not annotate, do not assert. Let TypeScript infer.**

The two mistakes this prevents:

1. **Re-annotating what TS already knows.** Every redundant `:` on a
   local variable or return type is the author claiming TS doesn't know
   something it actually does — and creating a place where the
   annotation can drift out of sync with reality.
2. **Asserting what TS doesn't know because the boundary didn't run.**
   Every `as` is the author skipping the boundary check and then
   pretending the check happened. The Valibot `parse` IS the check.
   There is no shortcut.

If you find yourself wanting to write `as` or `:` in the middle of a
function, stop. Ask: *did this value come in through a boundary that
ran `parse`?* If yes, the type is already correct — delete the
annotation/assertion and trust inference. If no, *that's* the bug —
add the `parse` at the boundary, not the assertion at the use site.

Generic constraints (`<T extends Foo>`) and parameter annotations
derived from `InferOutput` are not violations of this rule — they're
how you declare the boundary's shape.

### R0.1 — Use the narrowest available schema at every boundary

When you reach for a Valibot schema (to replace an `as`, to declare a
fixture, to type a parameter), pick the **tightest primitive that
matches the actual value's shape** — never widen.

```ts
// BAD — Hash32 says "32 bytes"; the value is 4
const fillDeadline = "0x65b3b3b3" as Hash32

// BAD — generic Hex; lets a 7-byte value compile silently
const fillDeadline = parse(hexSchema, "0x65b3b3b3")

// GOOD — value is 4 bytes, schema is bytes4
const fillDeadline = parse(bytes4Schema, "0x65b3b3b3")
```

If `@ethernauta/core` doesn't already expose a narrow-enough primitive,
that's a `core` gap — add the schema there (per `skills/core/SKILL.md`)
instead of widening the call site. Widening the schema to make the
existing value fit is the violation; the rule asks the schema, not the
value, to give ground.

Quick check before any `parse(...)` you're about to write: *is there a
narrower primitive in `@ethernauta/core` that exactly matches this
value's byte width / numeric range / enum membership?* If yes, use it.
If no, add it.

### R0.2 — No `any`, no `never`, no `unknown` unless it truly cannot be typed

`any`, `never`, and `unknown` are escape hatches in the same family as
`as`. They erase type information and let unsound code compile. They
are banned **unless the value's type genuinely cannot be expressed
strictly** — and "genuinely" means *I tried the strict form and it
provably doesn't work*, not *the strict form would be annoying to
write*.

The bar is high. Almost always there is a strict form using:

- **Generic type parameters.** `function f<T>(x: T): T` instead of
  `function f(x: any): any`. If `T` is heterogeneous across positions,
  use a generic tuple: `<Args extends readonly unknown[]>` plus a
  mapped tuple over the positions.
- **Variadic tuple types.** When you find yourself reaching for
  `Foo<any>[]`, the right shape is usually
  `{ readonly [K in keyof Args]: Foo<Args[K]> }` — a tuple of `Foo`s
  whose element types vary per position.
- **Discriminated unions.** Heterogeneous-but-finite shapes belong in
  a `variant()` Valibot schema, not in a `unknown`-typed bag.
- **`InferOutput<typeof xSchema>`.** The type of a parsed value comes
  from its schema. If you're tempted to type a parsed value as
  `unknown`, you parsed it wrong (or your schema is too loose).

**Worked example** — heterogeneous codec lists:

```ts
// BAD — `any` everywhere; the mapped-tuple `ValuesOf<Args>` looks
// strict but is decoratively cast to `unknown[]` internally, so the
// strict signature was a lie
function encode_function_call<
  Args extends readonly AbiCodec<any>[],
>(_input: {
  name: string
  args: Args
  values: ValuesOf<Args>
}): Uint8Array

// BAD (loose intermediate) — honest about the looseness, no lie
function encode_function_call(_input: {
  name: string
  args: readonly AbiCodec<any>[]
  values: readonly unknown[]
}): Uint8Array

// GOOD — strict, no escape hatches anywhere
function encode_function_call<
  Args extends readonly unknown[],
>(_input: {
  name: string
  args: { readonly [K in keyof Args]: AbiCodec<Args[K]> }
  values: Args
}): Uint8Array
```

**Allowed uses (the narrow list):**

- `<T>` and other generic type parameters — these ARE the strict form.
- `unknown` at a true open-world boundary that hasn't yet been
  validated by Valibot: the input to a `parse(schema, raw)`, the
  output of `JSON.parse`, an inbound `postMessage` payload, etc.
  Once `parse` runs, the type is no longer `unknown`.
- `never` in genuinely-impossible-branch positions: the default arm
  of an exhaustive `switch`, the return type of a function that
  always throws.
- TS-language operators that happen to use the keyword: `extends never`
  / `extends unknown` inside conditional type checks, `keyof never`
  in standard TS idioms.

**Banned uses (everything else):**

- `any` as a parameter, return, generic constraint, or property type.
  There is always a stricter alternative — find it.
- `unknown[]` as a function parameter when the call site knows the
  tuple shape (use variadic generics).
- `never` to silence the compiler ("this won't happen, trust me"):
  the compiler is telling you the type system can't prove your claim
  — make the claim provable instead.
- `Foo<any>[]` when `Foo<T>[]` plus a mapped-tuple generic would
  express the actual relationship.

**Rule of thumb:** before writing `any`, `never`, or `unknown` in any
position other than the narrow allowed list, write the strict generic
form first and try to make it compile. If it compiles, that's your
code. If it provably can't compile (and you can articulate why in one
sentence, citing the specific TS limitation), the looser form is
permitted as a temporary state with a `// TODO(R0.2): ...` comment
naming the next-phase work that will tighten it.

### R0.3 — No `!` non-null assertion; narrow with a real guard

`x!` is a cast in disguise — it lies to TS about `undefined` / `null`
without proving anything at runtime. Banned everywhere; tests get no
exemption.

The trigger is almost always `noUncheckedIndexedAccess` widening
`arr[i]` to `T | undefined`. Two acceptable resolutions, picked by
what the value actually is:

**(a) Genuine fixed-length tuple — fix the schema.** If the value
really is a pair / triple / fixed-N collection, declare it as a
tuple schema. Indexing within bounds returns the element type, no
guard needed.

```ts
// BAD
const pairSchema = array(bytesSchema)
const pair = parse(pairSchema, raw)
use(pair[0]!, pair[1]!)

// GOOD
const pairSchema = tuple([bytesSchema, bytesSchema])
const pair = parse(pairSchema, raw)
use(pair[0], pair[1])
```

Only when the value is *actually* a tuple. Forcing a variable-length
array into a tuple schema to dodge `!` is itself a lie.

**(b) Variable-length-but-non-empty input — encode the invariant in
the schema.** Use `tupleWithRest([elementSchema], elementSchema)` so
the parsed value's static type is `[T, ...T[]]` and indexing returns
`T`, not `T | undefined`. For "at least N" prepend N copies of
`elementSchema`.

```ts
import { parse, tupleWithRest } from "valibot"

const nonEmptyCallsSchema = tupleWithRest(
  [callableSchema],
  callableSchema,
)

// BAD — array schema + invariant in the interior
const calls = parse(array(callableSchema), raw)
const [first] = calls
invariant(first, "expected at least one call")

// GOOD — non-emptiness lives in the schema; the type already says so
const calls = parse(nonEmptyCallsSchema, raw)
use(calls[0])  // T, not T | undefined
```

Iteration (`for (const x of arr)`) over a plain `T[]` is also fine
when the algorithm tolerates an empty input. Both keep validation at
the boundary and let inference handle the interior. See
`packages/transport/src/multicall.ts` (commit `447a2e5f`) for the
canonical worked example. See R0.4 for the broader ban on
`invariant` / manual validation in production code.

### R0.4 — Valibot is the only validator. No `invariant`, no manual checks, outside tests

`invariant`, `if (!x) throw`, narrowing-only `typeof` / `Array.isArray` /
`instanceof` guards, and hand-rolled type-guard functions whose only
purpose is to validate a value are banned in production code. The
validator is Valibot. 99% Valibot, 1% `invariant` in tests — that's
the split.

Why this is absolute:

- Two validators = two sources of truth. A boundary `parse` and a
  downstream `invariant` both claim to describe the same value;
  schema changes don't propagate.
- Manual narrowing produces no runtime documentation. The Valibot
  schema IS the contract; an `invariant` is a TODO that compiled.
- Performance is not the argument — `parse` is sub-microsecond at a
  boundary crossed once per request.

**Banned in `packages/*/src/**`:**

- `invariant(...)` — was promoted under the previous R0.3(b); retired
  in production. Migrate to a Valibot schema that encodes the
  invariant in its type (`tupleWithRest`, `pipe(..., minLength(1))`,
  `variant`, required-field tightenings, etc.).
- `if (!x) throw new Error(...)` whose only purpose is downstream
  narrowing.
- `typeof` / `Array.isArray` / `instanceof` used as a narrowing step
  on a value supposed to be validated upstream.
- Hand-rolled `function isFoo(x): x is Foo` guards — use `safeParse`
  against a schema.

**Allowed:**

- `invariant(...)` in `**/*.test.ts`. Tests assert truths about their
  own fixtures; that's test bookkeeping, not data validation.
- Control-flow `typeof` / `Array.isArray` / `instanceof` checks that
  drive genuinely diverging branches (both arms do meaningful work).
  If one arm is "throw" and the other is "happy path," it's a guard
  pretending to be control flow — use a Valibot `variant` instead.
- `safeParse` at boundaries where the caller branches on validity
  rather than throws (e.g. optional UI decode paths).

**Allowed exceptions (the narrow B2 list — bootstrap preconditions):**

The Phase 6 manual-validation purge closed out 26 production
`invariant` sites; exactly one graduated to an explicit `if`-throw
because the schema route doesn't apply:

- `packages/wallet/src/entry.preact.tsx:7` — DOM `#app` root
  precondition at MV3 popup mount. Asserts a structural fact about
  the static `popup.html` the extension ships, not incoming data.
  Pattern: `if (!root) throw new Error("...")` with a comment naming
  the bootstrap precondition. The ratchet does not count `if`-throws
  this shaped.

New B2 sites need an entry here AND a comment in the code naming the
precondition. If you can express it as a schema, do that instead.

**Canonical replacement for "I need this value non-null here":**

```ts
// BAD — interior assertion
const tx = parse(genericTransactionSchema, raw)
invariant(tx.to, "eth_signTransaction requires a `to` address")
use(tx.to)

// GOOD — tighten the schema at the boundary
const signableTransactionSchema = object({
  ...genericTransactionSchema.entries,
  to: addressSchema,  // required, narrow primitive
})
const tx = parse(signableTransactionSchema, raw)
use(tx.to)  // Address, not Address | null | undefined
```

**Rule of thumb:** if you're about to write `invariant`, `!`, or
`if (!x) throw` in production code, the question is *which schema is
too loose?*, not *which assertion should I add?*.

## R1 — No `as` type assertion

**Banned, all of them.** Including:

- `x as T` — direct assertion
- `x as unknown as T` — double-step assertion (worse, since it nukes
  TS's structural check)
- `<T>x` — prefix assertion (same thing in JSX-incompatible syntax)
- `x as never` — narrowing tricks

**Allowed (because they are not type assertions):**

- `x as const` — literal-narrowing intent, not a lie about runtime
- `K as keyof T` and `as typeof X` inside generic constraints — these
  are TS-language operators, not user-defined coercions

**Canonical replacement for "I need to narrow this value":**

```ts
// BAD
const cfg = raw as Config

// GOOD
const cfg = parse(configSchema, raw)
```

**Canonical replacement for "I need to widen a generic":**

You don't. If TS won't accept the value at the wider position, redesign
the schema/signature so the value's static type matches what the
callsite expects. If genuinely heterogeneous, use a discriminated union
of Valibot schemas + `variant()`.

**Canonical replacement for "the callback bucket holds mixed types":**

Don't store mixed types in one bucket. One typed Set/Map per shape.
Dispatch by event name in `on`/`emit`. See `packages/eip/src/1193/events.ts`
for the worked example.

## R2 — No redundant `:` annotation on initialized variables

**Scope clarification (Phase 7 rescope, 2026-05-24):** R2 targets only
variable declarations. Function return-type annotations are part of
the signature contract — they document the shape callers consume and
keep error messages legible — so they are **not** banned. The original
"return-type if TS can infer" wording is retired.

**Banned:** variable annotations whose `T` is what TS would already
infer from the right-hand side. Two recurring shapes:

- `const x: Foo = make_foo()` when `make_foo()` already returns `Foo`.
- `const X: T = parse(tSchema, raw)` when `parse(tSchema, ...)` already
  returns `T` (the canonical case — the parse contract IS the type).

The narrow test: would deleting the `: T` change anything TS sees?
If no, the annotation was noise.

**Allowed (and frequently the right call):** `const x: T = { ... }` /
`const x: T = (() => { ... })()` where the right-hand side is an
author-constructed literal or IIFE. The annotation is doing real
work — pinning the literal's shape at the construction site so a
typo on a field name fails at the declaration line rather than
deeper inside the function. This is **compile-time shape assertion**,
not runtime validation. R0 / R0.4's "Valibot is the only validator"
rule is about untrusted runtime data flowing through boundaries
(postMessage receive, RPC response, JSON.parse, user input) — it
does not apply to literals the author writes inline. Don't force
those through `parse(...)`; the schema is already enforced by TS at
the assignment.

Worked examples that stay as `: T` annotations:
- `const response: TransactionRejectedResponse = { ... }` in wallet
  view handlers (outbound postMessage payload, locally constructed).
- `const tx: Eip1559TransactionUnsigned = { ... }` in
  `send-calls/index.tsx` (locally constructed before encoding).
- `const REGISTRY_BY_CHAIN: Record<string, Address> = { ... }` (an
  authored constant; the annotation widens the literal for arbitrary-
  key lookup).

**Allowed (TS literally cannot infer, or removing the annotation
breaks the algorithm):**

- **Declarations without an initializer.** `let recovery: number` /
  `let code: Bytes` — there is nothing to infer from.
- **Empty-seed mutation patterns.** `const out: number[] = []` /
  `let buf: number[] = []` — without the annotation TS infers
  `never[]` and the first `push` fails. If you'd rather avoid the
  seed, refactor to `Array.from` / `map` / `reduce` — but the
  annotation is allowed for the imperative form.
- **Nullable mutation seeds.** `let maker: Set<Group> | null = null`
  — TS would infer `null` and refuse subsequent assignment.
- **Narrowing the inferred type to a wider read-only contract.**
  `const IGNORED_SET: ReadonlySet<number> = new Set(IGNORED)` —
  the annotation enforces that downstream code can't mutate. Leave
  as-is, or prefer `const X = new Set(...) satisfies ReadonlySet<number>`
  if the contract should validate without widening the displayed
  type.
- **Function and method parameters.** TS can't infer parameter types
  from the body. Parameter type comes from `InferOutput<typeof xSchema>`
  or a structural primitive — never a hand-rolled `interface` /
  `type X = { ... }`.
- **Generic constraints** (`<T extends Foo>`).
- **Function-typed property declarations in record shapes** where the
  contract IS the type (e.g. the `decode` field of `Callable<T>`).
- **Function return-type annotations** — kept as the signature
  contract regardless of inference. `Readable<T>` / `Writable<T>` /
  `Signable<T>` / `Callable<T>` factory returns and the inner async
  function's `Promise<T>` annotation are the documented monorepo
  pattern. Removing them would technically not change what TS sees,
  but it would erase the documented surface and clutter error
  messages with the structural expansion.

**Rule of thumb:** if removing the annotation changes nothing TS sees
**and** the declaration is a `const`/`let`/`var` with an initializer
that isn't an empty seed, the annotation was noise. Delete it.

## R3 — No ignore comments, no exemptions

**Banned:**

- `@ts-ignore`
- `@ts-expect-error`
- `@ts-nocheck`
- `biome-ignore` (any variant)
- `biome-ignore-all`
- `eslint-disable` (any variant)
- File-level or path-level exemptions in `biome.json`'s `linter.includes`
  or `linter.overrides`
- Rule-level exemptions in `biome.json`'s `linter.rules.<group>.<rule>:
  off` UNLESS the rule is genuinely repo-wide wrong (in which case it is
  off globally, with no per-path override)

**Allowed in `biome.json`:**

- Excluding build outputs from formatter/assist (`dist/`, `build/`,
  `.wrangler/`, `.react-router/`).
- Disabling a rule globally if and only if the rule contradicts our
  conventions (e.g. `style.useConst: "off"` because we're snake_case-
  first). Globally — not per-path.

**Canonical replacement for "this file generates code that breaks lint":**

Fix the generator. Generated files must comply with the same rules.

**Canonical replacement for "this test does X you'd normally ban":**

It does X because the production code allows X. Fix the production
code. Tests do not get carve-outs.

## R4 — No hand-rolled `interface` / object `type`

(Reaffirmation of Hard rule #1; reproduced here because R1 and R2
depend on it.)

**Banned:**

- `interface Foo { ... }`
- `type Foo = { ... }`
- `type Foo = { ... } | { ... }`

**Canonical replacement:**

```ts
import { type InferOutput, object, parse } from "valibot"

const fooSchema = object({ ... })
type Foo = InferOutput<typeof fooSchema>
```

Validate at every boundary with `parse(fooSchema, raw)`. Throws are the
contract — never `safeParse`.

**Allowed exceptions (the narrow list):**

1. **Recursive Valibot schemas.** `lazy()` requires a forward-declared
   hand-rolled type to break the inference cycle
   (`GenericSchema<T>` where `T` is the recursive shape). This is the
   pattern Valibot's own docs prescribe. Current instances:
   `packages/abi/src/abi/function/function-shared.ts:AbiInput`
   and `packages/ens/src/ensip-15/normalize.ts:Node`.
2. **Declaration merging on global / built-in interfaces.** TypeScript
   requires the `interface` keyword for declaration merging. Current
   instance: `packages/transaction/src/store.ts:Window` (augments
   `globalThis.Window` with `transactions?: Map<...>`).
3. **Function-bearing strategy / DI interfaces.** When the type's job
   is to declare a contract whose fields are functions with per-call
   type relations (often generic), no Valibot schema can capture the
   call signature. Use `Readonly<{ ... }>` so the regex-form-banned
   `type X = {` does not match. Convention:

   ```ts
   // Function-bearing DI contract — kept as an intersection-shaped
   // alias because Valibot cannot type per-call argument relations.
   export type Store = Readonly<{
     get: (hash: Hash32) => Promise<Transaction | undefined>
     set: (hash: Hash32, transaction: Transaction) => Promise<void>
   }>
   ```

Any new exception must fall into one of the three above and carry the
matching comment in-file. The ratchet baseline only counts declarations
that match the form-banned regex; `Readonly<...>`, intersection (`&`),
and `extends`-based shapes pass through silently — that's intentional,
because the form is what signals "I am NOT a Valibot-typeable value
record."

## R5 — Generators are subject to the same rules

The output of `packages/abi/src/generator/generator.ts`, the chain
generator, and any future codegen must itself pass R1–R4. Generators
are not a loophole. If a generated file violates a rule, the generator
is broken.

## The ratchet

`scripts/no-escape-hatches.sh` reads the seven counters
(`as` / `ts-ignore` / `biome-ignore` line / `biome-ignore-all` /
`interface` / `object type` / `eslint-disable`) from the workspace and
compares them to `scripts/no-escape-hatches.baseline.json`. Any counter
above its baseline fails the script.

Run it locally:

```bash
bash scripts/no-escape-hatches.sh
```

When a phase lands and a counter genuinely drops, **lower the
baseline** in the same commit. The baseline only ever moves down.
