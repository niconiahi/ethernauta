// Polynomial operations over Fr, in the "Lagrange / evaluation form"
// used by the EIP-4844 polynomial-commitments module.
//
// A polynomial of width N = FIELD_ELEMENTS_PER_BLOB is represented as
// the array of its N evaluations at the bit-reversed roots of unity
// `roots_of_unity_brp()`. So `poly[i]` is the polynomial's value at
// `roots_of_unity_brp()[i]`.
//
// Reference: consensus-specs `polynomial-commitments` §
// "evaluate_polynomial_in_evaluation_form", §
// "compute_quotient_eval_within_domain".
import { FIELD_ELEMENTS_PER_BLOB } from "../constants"
import { Fr } from "./field"
import { roots_of_unity_brp } from "./roots-of-unity"

const N = FIELD_ELEMENTS_PER_BLOB
const N_BIG = BigInt(N)

// f(z) = ((z^N - 1) / N) * sum_i ( f(omega_i) * omega_i / (z - omega_i) )
// where omega_i runs over the bit-reversed roots of unity. If z happens
// to be one of those roots, the answer is just poly[index_of(z)].
export function evaluate_polynomial_in_evaluation_form(
  _poly: bigint[],
  _z: bigint,
): bigint {
  if (_poly.length !== N) {
    throw new Error(
      `evaluate_polynomial_in_evaluation_form: expected ${N} elements, got ${_poly.length}`,
    )
  }
  const roots = roots_of_unity_brp()
  // Domain hit — trivial.
  for (let i = 0; i < N; i += 1) {
    if ((roots[i] as bigint) === _z) {
      return _poly[i] as bigint
    }
  }
  // Build all (z - omega_i) and batch-invert.
  const denominators = new Array<bigint>(N)
  for (let i = 0; i < N; i += 1) {
    denominators[i] = Fr.sub(_z, roots[i] as bigint)
  }
  const inverses = Fr.invertBatch(denominators)
  let acc = 0n
  for (let i = 0; i < N; i += 1) {
    const term = Fr.mul(
      Fr.mul(_poly[i] as bigint, roots[i] as bigint),
      inverses[i] as bigint,
    )
    acc = Fr.add(acc, term)
  }
  // r = z^N - 1
  const r = Fr.sub(Fr.pow(_z, N_BIG), 1n)
  const inverse_width = Fr.inv(Fr.create(N_BIG))
  return Fr.mul(Fr.mul(acc, r), inverse_width)
}

// Given p evaluated at all roots (= `polynomial`) and y = p(z) where z
// happens to be a root of unity, compute q(z) for q(x) = (p(x) - p(z)) / (x - z).
// Used as a special-case fixup inside `compute_kzg_proof` when the
// chosen evaluation point coincides with a domain root.
export function compute_quotient_eval_within_domain(
  _z: bigint,
  _poly: bigint[],
  _y: bigint,
): bigint {
  const roots = roots_of_unity_brp()
  // Collect numerators and denominators for batch inversion.
  const num_terms: bigint[] = []
  const denoms: bigint[] = []
  for (let i = 0; i < N; i += 1) {
    const omega_i = roots[i] as bigint
    if (omega_i === _z) continue
    const f_i = Fr.sub(_poly[i] as bigint, _y)
    const numerator = Fr.mul(f_i, omega_i)
    const denominator = Fr.mul(_z, Fr.sub(_z, omega_i))
    num_terms.push(numerator)
    denoms.push(denominator)
  }
  const inv_denoms = Fr.invertBatch(denoms)
  let acc = 0n
  for (let i = 0; i < num_terms.length; i += 1) {
    acc = Fr.add(
      acc,
      Fr.mul(
        num_terms[i] as bigint,
        inv_denoms[i] as bigint,
      ),
    )
  }
  return acc
}

// Quotient polynomial q(x) = (p(x) - p(z)) / (x - z), returned in
// evaluation form on the same domain as p. The proof is the commitment
// to this polynomial.
export function compute_quotient_polynomial(
  _poly: bigint[],
  _z: bigint,
  _y: bigint,
): bigint[] {
  const roots = roots_of_unity_brp()
  // First pass: for each domain point, prep (numerator, denominator)
  // and remember the indices that hit z exactly (denominator zero).
  const num_terms = new Array<bigint>(N)
  const denoms = new Array<bigint>(N)
  const collision_indices: number[] = []
  for (let i = 0; i < N; i += 1) {
    const omega_i = roots[i] as bigint
    const denom = Fr.sub(omega_i, _z)
    if (denom === 0n) {
      collision_indices.push(i)
      num_terms[i] = 0n
      denoms[i] = 1n // placeholder, ignored
      continue
    }
    num_terms[i] = Fr.sub(_poly[i] as bigint, _y)
    denoms[i] = denom
  }
  const inv_denoms = Fr.invertBatch(denoms)
  const quotient = new Array<bigint>(N)
  for (let i = 0; i < N; i += 1) {
    quotient[i] = Fr.mul(
      num_terms[i] as bigint,
      inv_denoms[i] as bigint,
    )
  }
  // Fix up the collisions with the special-case formula.
  for (const idx of collision_indices) {
    quotient[idx] = compute_quotient_eval_within_domain(
      roots[idx] as bigint,
      _poly,
      _y,
    )
  }
  return quotient
}
