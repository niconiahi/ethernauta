#!/usr/bin/env bash
#
# Ratchet for the no-casts-no-annotations-no-ignores cleanup.
#
# Reads twelve counters from packages/ and enforces them against
# scripts/no-escape-hatches.baseline.json. Phase 10 (lock the door)
# locks ten counters at HARD ZERO:
#
#   as, ts_ignore, biome_ignore_line, biome_ignore_all, interface,
#   object_type, eslint_disable, any, invariant_calls, redundant_annotations
#
# Any non-zero on those fails CI. The two remaining counters (`never`,
# `unknown`) mix legitimate uses (per R0.2's allowed list) with
# violations and so stay on NO-INCREASE semantics: rises above the
# baseline fail, drops are allowed.
#
# A small, audited set of lines is allowed to violate R1 / R4 because
# the rule's narrow exception list applies (recursive Valibot schema
# anchors, declaration merging on built-in globals, irreducible mapped-
# tuple boundary in `decode_function_result`). Mark those lines with a
# `// allow-violation: <tag>` comment IMMEDIATELY ABOVE the violation.
# The ratchet strips marked occurrences before counting. New marks must
# match an exception in `skills/no-violations/SKILL.md`.
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

# ---- allow-violation filter ----

# Strips lines whose preceding line carries `allow-violation:`. Input
# and output are `file:lineno:content` records (the canonical grep -n
# format). The Python implementation lives in
# `scripts/filter-allowed-violations.py` so the heredoc does not collide
# with piped stdin.
filter_allowed() {
  python3 "${REPO_ROOT}/scripts/filter-allowed-violations.py"
}

# Wraps a grep pipeline through filter_allowed and counts the surviving
# lines. `grep -c ''` counts lines; the `|| true` keeps empty input from
# tripping `set -e` (grep exits 1 when it matches nothing).
count_filtered() {
  filter_allowed | { grep -c '' || true; }
}

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
    | count_filtered
}

count_ts_ignore() {
  grep -rnE "@ts-(ignore|expect-error|nocheck)" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered
}

count_biome_ignore_line() {
  # `biome-ignore` raw count includes the `biome-ignore-all` headers;
  # subtract those to get the true line-level count.
  local raw all
  raw=$(grep -rnE "^\s*//\s*biome-ignore\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered)
  all=$(count_biome_ignore_all)
  echo $((raw - all))
}

count_biome_ignore_all() {
  grep -rnE "biome-ignore-all" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered
}

count_interface() {
  grep -rnE "^\s*(export\s+)?interface\s+\w" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered
}

count_object_type() {
  grep -rnE "^\s*(export\s+)?type\s+\w+\s*=\s*\{" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered
}

count_eslint_disable() {
  grep -rnE "eslint-disable" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | count_filtered
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
    | count_filtered
}

count_never() {
  # Raw `\bnever\b` outside line comments. R0.2 bans `never` except in
  # the narrow allowed list (throw-only return, conditional-type
  # bottom, exhaustive-switch default). The baseline therefore mixes
  # legitimate uses with violations — Phase 10 keeps this counter on
  # NO-INCREASE semantics, not hard-zero. Review every new occurrence
  # and either fix it or bump the baseline with a one-line justification.
  grep -rnE "\bnever\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | count_filtered
}

count_unknown() {
  # Raw `\bunknown\b` outside line comments. Same R0.2 framing as
  # `never`: legitimate uses (Valibot's `_raw: unknown`, JSON.parse
  # output, conditional-type `extends unknown`) are mixed into the
  # baseline; Phase 10 keeps this counter on NO-INCREASE semantics.
  # PRs that add a legit `unknown` justify the +1 in the commit.
  grep -rnE "\bunknown\b" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | count_filtered
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
  # in `@ethernauta/utils`, and comment lines. Phase 6 walked this
  # counter to zero; Phase 10 locks it at hard zero.
  grep -rnE "\binvariant\(" packages/ \
    --include="*.ts" --include="*.tsx" --exclude-dir=dist --exclude="*.d.ts" 2>/dev/null \
    | grep -vE "\.test\.ts:" \
    | grep -vE "packages/utils/src/invariant\.ts:" \
    | grep -vE "^[^:]+:[0-9]+:\s*(//|\*|/\*)" \
    | count_filtered
}

# ---- read baseline ----

read_baseline() {
  local key="$1"
  python3 -c "import json,sys; print(json.load(open('${BASELINE_FILE}'))['${key}'])"
}

# ---- compare ----

FAIL=0

# Hard-zero check: any non-zero current fails.
check_zero() {
  local label="$1"
  local current="$2"

  local status
  if (( current > 0 )); then
    status="FAIL"
    FAIL=1
  else
    status="ok  "
  fi

  printf "  %s  %-22s current=%-6s policy=hard-zero\n" \
    "${status}" "${label}" "${current}"
}

# No-increase check: current must be ≤ baseline.
check_no_increase() {
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

  printf "  %s  %-22s current=%-6s baseline=%-6s policy=no-increase\n" \
    "${status}" "${label}" "${current}" "${baseline}"
}

echo "no-escape-hatches ratchet"
echo "  baseline: ${BASELINE_FILE}"
echo

check_zero        "as"                "$(count_as)"
check_zero        "ts-ignore"         "$(count_ts_ignore)"
check_zero        "biome-ignore line" "$(count_biome_ignore_line)"
check_zero        "biome-ignore-all"  "$(count_biome_ignore_all)"
check_zero        "interface"         "$(count_interface)"
check_zero        "object type"       "$(count_object_type)"
check_zero        "eslint-disable"    "$(count_eslint_disable)"
check_zero        "any"               "$(count_any)"
check_zero        "invariant calls"   "$(count_invariant_calls)"
check_zero        "redundant : annot" "$(count_redundant_annotations)"
check_no_increase "never"             "$(count_never)"   "never"
check_no_increase "unknown"           "$(count_unknown)" "unknown"

echo
if (( FAIL == 1 )); then
  echo "ratchet: at least one counter is in violation." >&2
  echo "  hard-zero counters must stay at 0 — fix the new" >&2
  echo "  occurrence or, if it is genuinely an R1/R4/R0.2/R0.4" >&2
  echo "  documented exception, mark it with" >&2
  echo "  '// allow-violation: <tag>' on the line above per" >&2
  echo "  skills/no-violations/SKILL.md." >&2
  echo "  no-increase counters (never / unknown) must stay ≤ baseline;" >&2
  echo "  legit additions go in a separate commit with a justification" >&2
  echo "  in the baseline JSON's adjacent _comment key." >&2
  exit 1
fi

echo "ratchet: ok"
