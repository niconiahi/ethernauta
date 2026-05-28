import type { InferOutput } from "valibot"
import {
  check,
  literal,
  object,
  pipe,
  string,
  union,
} from "valibot"

// Closed set of Solidity ABI elementary leaves per the canonical
// spec at https://docs.soliditylang.org/en/latest/abi-spec.html#types.
// Adds no aliases on top — `byte`, `bytesMax32`, `hash32` were
// ethernauta-isms previously baked in here and have been removed.
const ELEMENTARY_LEAVES: ReadonlySet<string> = (() => {
  const s = new Set<string>([
    "bool",
    "string",
    "address",
    "bytes",
    "uint", // alias for uint256
    "int", // alias for int256
  ])
  for (let n = 1; n <= 32; n += 1) s.add(`bytes${n}`)
  for (let m = 8; m <= 256; m += 8) {
    s.add(`uint${m}`)
    s.add(`int${m}`)
  }
  return s
})()

// Validate a chain of array suffixes — each one is `[]` (dynamic) or
// `[<positive integer>]` (fixed-length). Hand-parsed character by
// character so no regex sits at the schema boundary. Returns true
// iff the entire input is exactly such a chain (possibly empty).
function is_array_suffix_chain(_s: string): boolean {
  let i = 0
  while (i < _s.length) {
    if (_s[i] !== "[") return false
    i += 1
    if (_s[i] === "]") {
      i += 1
      continue
    }
    // First digit must be 1-9 — no leading zero, no zero-length array.
    const first = _s[i]
    if (first === undefined || first < "1" || first > "9")
      return false
    i += 1
    while (i < _s.length) {
      const ch = _s[i]
      if (ch === undefined) return false
      if (ch >= "0" && ch <= "9") {
        i += 1
        continue
      }
      break
    }
    if (_s[i] !== "]") return false
    i += 1
  }
  return true
}

function is_solidity_type(_s: string): boolean {
  const bracket = _s.indexOf("[")
  const leaf = bracket === -1 ? _s : _s.slice(0, bracket)
  const suffix = bracket === -1 ? "" : _s.slice(bracket)
  if (!ELEMENTARY_LEAVES.has(leaf)) return false
  return is_array_suffix_chain(suffix)
}

export const TypeSchema = pipe(
  string(),
  check(is_solidity_type),
)
export type Type = InferOutput<typeof TypeSchema>

export const TupleSchema = object({
  name: string(),
  type: union([literal("tuple"), literal("tuple[]")]),
})
