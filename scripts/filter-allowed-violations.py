#!/usr/bin/env python3
"""Strip `file:lineno:content` records whose preceding line carries an
`allow-violation:` marker.

Read from stdin, write surviving records to stdout. Used by
`scripts/no-escape-hatches.sh` to subtract documented R1 / R4 / R0.4
exceptions (recursive Valibot schema anchors, declaration merging on
built-in globals, irreducible mapped-tuple boundary in
`decode_function_result`) from the raw ratchet counts.

The marker convention is documented in `skills/no-violations/SKILL.md`:
place `// allow-violation: <tag>` on the line IMMEDIATELY ABOVE the
violation. The script only inspects the (N-1)th line; markers on the
same line or two-plus lines above are intentionally ignored so the
mechanism stays mechanically simple.
"""

import sys

_cache = {}


def prev_line(path: str, lineno: int) -> str:
    if path not in _cache:
        try:
            with open(path, "r", encoding="utf-8") as fh:
                _cache[path] = fh.readlines()
        except OSError:
            _cache[path] = []
    lines = _cache[path]
    idx = lineno - 2
    if 0 <= idx < len(lines):
        return lines[idx]
    return ""


def main() -> None:
    for raw in sys.stdin:
        line = raw.rstrip("\n")
        parts = line.split(":", 2)
        if len(parts) < 3:
            print(line)
            continue
        path, lineno_s, _content = parts
        try:
            lineno = int(lineno_s)
        except ValueError:
            print(line)
            continue
        if "allow-violation:" in prev_line(path, lineno):
            continue
        print(line)


if __name__ == "__main__":
    main()
