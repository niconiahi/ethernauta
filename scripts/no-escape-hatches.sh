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
  grep -rnE "\bas\s+([A-Z]\w*|\{|\()" packages/ \
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

echo
if (( FAIL == 1 )); then
  echo "ratchet: at least one counter rose above baseline." >&2
  echo "  fix the new violation or, if the rise is intentional," >&2
  echo "  justify it before raising the baseline (raising is" >&2
  echo "  almost always wrong — the baseline only moves DOWN)." >&2
  exit 1
fi

echo "ratchet: ok"
