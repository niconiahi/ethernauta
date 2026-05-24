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
