// Number-Theoretic Transform (FFT over the BLS scalar field Fr).
// Cooley-Tukey decimation-in-time, in-place, radix-2.
//
// `inverse_ntt(values_brp_eval)` consumes BRP-ordered evaluations on
// the order-N roots-of-unity domain and produces natural-ordered
// polynomial coefficients. This is what we use to go from "blob"
// (eval form, BRP) to "polynomial coefficients" (monomial), so we
// can commit against a monomial-form g1 trusted setup.
//
// Per-call cost on N=4096: ~12 butterfly levels × ~2048 ops/level
// ≈ 25k Fr mul+add — order of tens of ms in JS.
import { FIELD_ELEMENTS_PER_BLOB } from "../constants"
import { Fr } from "./field"
import { roots_of_unity } from "./roots-of-unity"

const N = FIELD_ELEMENTS_PER_BLOB

// Natural-order inverse roots: inv_omega^i = omega^(-i mod N) = omega^(N-i).
// Precomputed on first call.
let cached_inverse_roots: bigint[] | null = null
function inverse_roots(): bigint[] {
  if (cached_inverse_roots) return cached_inverse_roots
  const natural = roots_of_unity()
  const out = new Array<bigint>(N)
  out[0] = 1n
  for (let i = 1; i < N; i += 1) {
    out[i] = natural[N - i] as bigint
  }
  cached_inverse_roots = out
  return out
}

// Inverse NTT: input is BRP-ordered evaluations of length N, output is
// natural-ordered coefficients of length N. (Cooley-Tukey DIT consumes
// BRP-ordered input, so we do not pre-permute.)
export function inverse_ntt(_values_brp: bigint[]): bigint[] {
  if (_values_brp.length !== N) {
    throw new Error(
      `inverse_ntt: expected ${N} values, got ${_values_brp.length}`,
    )
  }
  const inv_roots = inverse_roots()
  const a = _values_brp.slice()
  // Cooley-Tukey DIT, radix-2.
  for (let size = 2; size <= N; size <<= 1) {
    const half = size >> 1
    const step = N / size // index step into inv_roots for the twiddle
    for (let block = 0; block < N; block += size) {
      for (let j = 0; j < half; j += 1) {
        const w = inv_roots[j * step] as bigint
        const u = a[block + j] as bigint
        const v = Fr.mul(a[block + j + half] as bigint, w)
        a[block + j] = Fr.add(u, v)
        a[block + j + half] = Fr.sub(u, v)
      }
    }
  }
  // Divide by N (multiply by N^-1 mod r).
  const n_inv = Fr.inv(BigInt(N))
  for (let i = 0; i < N; i += 1) {
    a[i] = Fr.mul(a[i] as bigint, n_inv)
  }
  return a
}
