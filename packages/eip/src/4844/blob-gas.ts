// https://eips.ethereum.org/EIPS/eip-4844 §"Gas accounting"
import {
  BLOB_GASPRICE_UPDATE_FRACTION,
  MIN_BLOB_GASPRICE,
} from "./constants"

// Direct port of the spec's `fake_exponential(factor, numerator, denominator)`.
// Approximates `factor * e^(numerator / denominator)` using a Taylor-style
// sum truncated when the running term hits zero.
export function fake_exponential(
  factor: bigint,
  numerator: bigint,
  denominator: bigint,
): bigint {
  let i = 1n
  let output = 0n
  let numerator_accum = factor * denominator
  while (numerator_accum > 0n) {
    output += numerator_accum
    numerator_accum =
      (numerator_accum * numerator) / (denominator * i)
    i += 1n
  }
  return output / denominator
}

// `get_blob_gasprice(excess_blob_gas)` — the per-blob-gas price for the
// next block given how much blob gas the chain has been carrying over.
export function get_blob_gasprice(
  excess_blob_gas: bigint,
): bigint {
  return fake_exponential(
    MIN_BLOB_GASPRICE,
    excess_blob_gas,
    BLOB_GASPRICE_UPDATE_FRACTION,
  )
}
