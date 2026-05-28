// https://eips.ethereum.org/EIPS/eip-1559

import type { InferOutput } from "valibot"
import { bigint, object, parse } from "valibot"

export const EffectiveGasPriceInputSchema = object({
  max_priority_fee_per_gas: bigint(),
  max_fee_per_gas: bigint(),
  base_fee_per_gas: bigint(),
})
export type EffectiveGasPriceInput = InferOutput<
  typeof EffectiveGasPriceInputSchema
>

export function effective_gas_price(
  _input: EffectiveGasPriceInput,
): bigint {
  const input = parse(EffectiveGasPriceInputSchema, _input)
  const headroom =
    input.max_fee_per_gas - input.base_fee_per_gas
  const priority_fee_per_gas = min(
    input.max_priority_fee_per_gas,
    headroom,
  )
  return priority_fee_per_gas + input.base_fee_per_gas
}

function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}
