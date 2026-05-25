#!/usr/bin/env bash
#
# Ratchet for the no-casts-no-annotations-no-ignores cleanup.
#
# Reads seven counters from packages/ and compares them to the values
# in scripts/no-escape-hatches.baseline.json. Any counter ABOVE its
# baseline fails the script with a non-zero exit code. Counters AT or
# BELOW their baseline pass.
#
# When a phase lands a real reduction, update the baseline JSON in the
# SAME commit so subsequent runs hold the new floor.
#
# See skills/no-violations/SKILL.md for the substantive rules.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE_FILE="${REPO_ROOT}/scripts/no-escape-hatches.baseline.json"

cd "${REPO_ROOT}"

if [[ ! -f "${BASELINE_FILE}" ]]; then
  echo "ratchet: baseline file missing at ${BASELINE_FILE}" >&2
  exit 2
fi

# ---- counters ----

count_as() {
  # Counts every banned form of `as`: `as PascalType`, `as { ... }`,
  # `as (...) =>`, plus the four lowercase banned coercions
  # `never|unknown|null|undefined`. The three allowed operators
  # (`const|keyof|typeof`) are excluded. Comments and import/export
  # statements (where `as` is the rename keyword, not a coercion) are
  # stripped first.
  grep -rnE "\bas\s+([A-Z]\w*|\{|\(|never|unknown|null|undefined)\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "\bas\s+(const|keyof|typeof)\b" \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | grep -vE "^[^:]+:[0-9]+:\s*import\s|^[^:]+:[0-9]+:\s*export\s.*\bfrom\b" \
    | wc -l | tr -d ' '
}

count_ts_ignore() {
  grep -rnE "@ts-(ignore|expect-error|nocheck)" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | wc -l | tr -d ' '
}

count_biome_ignore_line() {
  # `biome-ignore` raw count includes the `biome-ignore-all` headers;
  # subtract those to get the true line-level count.
  local raw all
  raw=$(grep -rnE "^\s*//\s*biome-ignore\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null | wc -l | tr -d ' ')
  all=$(count_biome_ignore_all)
  echo $((raw - all))
}

count_biome_ignore_all() {
  grep -rnE "biome-ignore-all" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | wc -l | tr -d ' '
}

count_interface() {
  grep -rnE "^\s*(export\s+)?interface\s+\w" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | wc -l | tr -d ' '
}

count_object_type() {
  grep -rnE "^\s*(export\s+)?type\s+\w+\s*=\s*\{" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | wc -l | tr -d ' '
}

count_eslint_disable() {
  grep -rnE "eslint-disable" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | wc -l | tr -d ' '
}

count_any() {
  # `any` in TS type positions: `: any`, `<any>`, `<any,`, `any[]`,
  # `any |`, `as any`. Skips the JS `Promise.any(...)` method and
  # incidental English uses in comments / strings. R0.2 in
  # skills/no-violations/SKILL.md bans `any` except in the narrow
  # allowed list.
  grep -rnE ":\s*any\b|<any[>,]|\bany\[\]|\bany\s*\||\bas\s+any\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | wc -l | tr -d ' '
}

count_never() {
  # Raw `\bnever\b` outside line comments. R0.2 bans `never` except in
  # the narrow allowed list (throw-only return, conditional-type
  # bottom, exhaustive-switch default). The baseline therefore mixes
  # legitimate uses with violations — the ratchet's job is to flag
  # deltas; review every new occurrence and either fix it or bump the
  # baseline with a one-line justification in the commit.
  grep -rnE "\bnever\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | wc -l | tr -d ' '
}

count_unknown() {
  # Raw `\bunknown\b` outside line comments. Same R0.2 framing as
  # `never`: legitimate uses (Valibot's `_raw: unknown`, JSON.parse
  # output, conditional-type `extends unknown`) are mixed into the
  # baseline; the ratchet enforces no-increase, and PRs that add a
  # legit `unknown` justify the +1 in the commit.
  grep -rnE "\bunknown\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | wc -l | tr -d ' '
}

count_redundant_annotations() {
  # Variable declarations whose `: T` annotation is mutually-assignable-
  # equal to TypeScript's inference of the initializer (R2). Computed via
  # the TS compiler API in scripts/find-redundant-annotations.mjs; see
  # that file for the skip rules (no-init, empty-seed, null-seed, object/
  # array literal, IIFE, bare arrow / function expression, any-poisoning).
  node "${REPO_ROOT}/scripts/find-redundant-annotations.mjs" --count
}

count_invariant_calls() {
  # Production `invariant(` call sites per R0.4 — Valibot is the only
  # validator. Excludes test files, the `invariant` definition itself
  # in `@ethernauta/utils`, and comment lines. Phase 6 of the
  # no-casts-no-annotations plan walks this counter to zero modulo a
  # short documented B2 exception list (bootstrap preconditions like
  # `entry.preact.tsx`'s `#app` root check).
  grep -rnE "\binvariant\(" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "\.test\.ts:" \
    | grep -vE "packages/utils/src/invariant\.ts:" \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | wc -l | tr -d ' '
}

# ---- read baseline ----

read_baseline() {
  local key="$1"
  python3 -c "import json,sys; print(json.load(open('${BASELINE_FILE}'))['${key}'])"
}

# ---- compare ----

FAIL=0

check() {
  local label="$1"
  local current="$2"
  local key="$3"
  local baseline
  baseline=$(read_baseline "${key}")

  local status
  if (( current > baseline )); then
    status="FAIL"
    FAIL=1
  elif (( current < baseline )); then
    status="DROP"
  else
    status="ok  "
  fi

  printf "  %s  %-22s current=%-6s baseline=%-6s\n" \
    "${status}" "${label}" "${current}" "${baseline}"
}

echo "no-escape-hatches ratchet"
echo "  baseline: ${BASELINE_FILE}"
echo

check "as"                "$(count_as)"                "as"
check "ts-ignore"         "$(count_ts_ignore)"         "ts_ignore"
check "biome-ignore line" "$(count_biome_ignore_line)" "biome_ignore_line"
check "biome-ignore-all"  "$(count_biome_ignore_all)"  "biome_ignore_all"
check "interface"         "$(count_interface)"         "interface"
check "object type"       "$(count_object_type)"       "object_type"
check "eslint-disable"    "$(count_eslint_disable)"    "eslint_disable"
check "any"               "$(count_any)"               "any"
check "never"             "$(count_never)"             "never"
check "unknown"           "$(count_unknown)"           "unknown"
check "invariant calls"   "$(count_invariant_calls)"   "invariant_calls"
check "redundant : annot" "$(count_redundant_annotations)" "redundant_annotations"

echo
if (( FAIL == 1 )); then
  echo "ratchet: at least one counter rose above baseline." >&2
  echo "  fix the new violation or, if the rise is intentional," >&2
  echo "  justify it before raising the baseline (raising is" >&2
  echo "  almost always wrong — the baseline only moves DOWN)." >&2
  exit 1
fi

echo "ratchet: ok"
