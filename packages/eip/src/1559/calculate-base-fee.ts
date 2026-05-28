// https://eips.ethereum.org/EIPS/eip-1559

import type { InferOutput } from "valibot"
import { bigint, object, parse } from "valibot"
import {
  BASE_FEE_MAX_CHANGE_DENOMINATOR,
  ELASTICITY_MULTIPLIER,
} from "./constants"

export const CalculateBaseFeeInputSchema = object({
  parent_gas_used: bigint(),
  parent_gas_limit: bigint(),
  parent_base_fee_per_gas: bigint(),
})
export type CalculateBaseFeeInput = InferOutput<
  typeof CalculateBaseFeeInputSchema
>

export function calculate_base_fee(
  _input: CalculateBaseFeeInput,
): bigint {
  const input = parse(CalculateBaseFeeInputSchema, _input)
  const parent_gas_target =
    input.parent_gas_limit / ELASTICITY_MULTIPLIER
  if (input.parent_gas_used === parent_gas_target) {
    return input.parent_base_fee_per_gas
  }
  if (input.parent_gas_used > parent_gas_target) {
    const gas_used_delta =
      input.parent_gas_used - parent_gas_target
    const base_fee_per_gas_delta = max(
      (input.parent_base_fee_per_gas * gas_used_delta) /
        parent_gas_target /
        BASE_FEE_MAX_CHANGE_DENOMINATOR,
      1n,
    )
    return (
      input.parent_base_fee_per_gas + base_fee_per_gas_delta
    )
  }
  const gas_used_delta =
    parent_gas_target - input.parent_gas_used
  const base_fee_per_gas_delta =
    (input.parent_base_fee_per_gas * gas_used_delta) /
    parent_gas_target /
    BASE_FEE_MAX_CHANGE_DENOMINATOR
  return (
    input.parent_base_fee_per_gas - base_fee_per_gas_delta
  )
}

function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}
