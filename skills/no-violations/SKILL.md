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

**(b) Variable-length array — destructure and narrow with `invariant`.**
Iterate (`for (const x of arr)`) or destructure and assert with
`invariant` from `@ethernauta/utils`.

```ts
import { invariant } from "@ethernauta/utils"

// BAD
const first = arr[0]!

// GOOD
const [first] = arr
invariant(first, "expected at least one element")
// `first` is T here, not T | undefined
```

`invariant(condition, message)` is typed `asserts condition`, so TS
narrows after the call. Prefer it over a hand-rolled `if (!x) throw`
so failure messages stay uniform. Tests that want `fixture[0]` should
either declare the fixture as a tuple (a) or extract the element to a
named `const` — only reach for `invariant` when the array genuinely
arrives from a function call whose return shape is `T[]`.

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

## R2 — No redundant `:` type annotation

**Banned:**

- Return-type annotations on functions that can infer (`function x(): T {`
  when TS infers the same `T`)
- Variable annotations on initialized declarations (`const x: T = expr`
  when TS infers the same `T`)
- Annotations on `const`-initialized exports (`export const X: T = {...}`)

**Allowed (because TS cannot infer them):**

- Function and method parameters — TS cannot infer these from the body.
  But the parameter type should be `Parameters` / `Schema-derived` /
  a structural shape from a Valibot `InferOutput`, never a hand-rolled
  `interface` or `type X = { ... }`.
- Generic constraints (`<T extends Foo>`).
- Function-typed property declarations in record shapes where the
  contract IS the type (e.g. the `decode` field of `Callable<T>`).
- Inner arrow return-type annotations where it pins the public surface
  and TS cannot infer the right return shape (rare; the generator's
  `Callable<T>` arrow is the example we agreed to keep).

**Rule of thumb:** if removing the annotation changes nothing TS sees,
the annotation was noise. Delete it. This is R0 in operational form —
TS already knew, you were just repeating yourself.

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
   `packages/abi/src/abi/function/function-shared.ts:TupleComponent`
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
