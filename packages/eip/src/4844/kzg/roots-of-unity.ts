// Roots of unity domain used by the EIP-4844 polynomial-commitments
// module. The blob's 4096 field elements are evaluations of the
// underlying polynomial at these roots, in *bit-reversed* order.
//
// Reference: consensus-specs `polynomial-commitments` §"compute_roots_of_unity",
// §"bit_reversal_permutation".
import {
  FIELD_ELEMENTS_PER_BLOB,
  PRIMITIVE_ROOT_OF_UNITY,
} from "../constants"
import { Fr } from "./field"

// roots[i] = PRIMITIVE_ROOT_OF_UNITY^i mod r. Order: natural (NOT bit-
// reversed). Callers that need the consensus-spec ordering must apply
// `bit_reversal_permutation` themselves.
let cached_roots: bigint[] | null = null
export function roots_of_unity(): bigint[] {
  if (cached_roots) return cached_roots
  const out = new Array<bigint>(FIELD_ELEMENTS_PER_BLOB)
  let acc = 1n
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i += 1) {
    out[i] = acc
    acc = Fr.mul(acc, PRIMITIVE_ROOT_OF_UNITY)
  }
  cached_roots = out
  return out
}

// The blob's element at index `i` corresponds to the polynomial's value
// at `roots_of_unity()[reverse_bits(i, BITS)]`, where BITS = log2(N).
const BITS = Math.log2(FIELD_ELEMENTS_PER_BLOB)
if (!Number.isInteger(BITS)) {
  throw new Error(
    "FIELD_ELEMENTS_PER_BLOB must be a power of two",
  )
}

export function reverse_bits(
  _value: number,
  _bit_length: number = BITS,
): number {
  let out = 0
  let v = _value
  for (let i = 0; i < _bit_length; i += 1) {
    out = (out << 1) | (v & 1)
    v >>>= 1
  }
  return out >>> 0
}

let cached_brp_roots: bigint[] | null = null
export function roots_of_unity_brp(): bigint[] {
  if (cached_brp_roots) return cached_brp_roots
  const natural = roots_of_unity()
  const out = new Array<bigint>(FIELD_ELEMENTS_PER_BLOB)
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i += 1) {
    out[i] = natural[reverse_bits(i) as number] as bigint
  }
  cached_brp_roots = out
  return out
}

// In-place bit-reversal permutation of an array of length N. Used to
// move between "natural ordering" and "consensus-specs ordering".
export function bit_reversal_permutation<T>(_arr: T[]): T[] {
  const n = _arr.length
  const bits = Math.log2(n)
  if (!Number.isInteger(bits)) {
    throw new Error(
      "bit_reversal_permutation: length must be a power of two",
    )
  }
  const out = _arr.slice()
  for (let i = 0; i < n; i += 1) {
    const j = reverse_bits(i, bits)
    if (j > i) {
      const tmp = out[i] as T
      out[i] = out[j] as T
      out[j] = tmp
    }
  }
  return out
}
