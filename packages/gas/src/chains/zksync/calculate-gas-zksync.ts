// Coarse zkSync gas estimator. Trivial: forward the user's tx to
// `zks_estimateFee` and re-tag the four-field response so it
// matches the discriminated-union shape the dispatcher returns.

import {
  addressSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { literal, object, optional, parse } from "valibot"

import { zks_estimate_fee } from "./zks-estimate-fee"

export const calculateGasZksyncParametersSchema = object({
  tx: object({
    from: optional(addressSchema),
    to: addressSchema,
    value: optional(uintSchema),
    input: optional(bytesSchema),
  }),
})
export type CalculateGasZksyncParameters = InferOutput<
  typeof calculateGasZksyncParametersSchema
>

export const calculateGasZksyncFeesSchema = object({
  kind: literal("zksync"),
  gas_limit: uintSchema,
  gas_per_pubdata_limit: uintSchema,
  max_fee_per_gas: uintSchema,
  max_priority_fee_per_gas: uintSchema,
})
export type CalculateGasZksyncFees = InferOutput<
  typeof calculateGasZksyncFeesSchema
>

export function calculate_gas_zksync(
  _parameters: CalculateGasZksyncParameters,
): Readable<CalculateGasZksyncFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<CalculateGasZksyncFees> => {
    const parameters = parse(
      calculateGasZksyncParametersSchema,
      _parameters,
    )
    const fee = await zks_estimate_fee(parameters.tx)(
      resolved,
    )
    return parse(calculateGasZksyncFeesSchema, {
      kind: "zksync",
      ...fee,
    })
  }
}
