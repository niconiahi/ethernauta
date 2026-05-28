// Coarse zkSync gas estimator. Trivial: forward the user's tx to
// `zks_estimateFee` and re-tag the four-field response so it
// matches the discriminated-union shape the dispatcher returns.

import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { literal, object, optional, parse } from "valibot"

import { zks_estimate_fee } from "./zks-estimate-fee"

export const CalculateGasZksyncParametersSchema = object({
  tx: object({
    from: optional(AddressSchema),
    to: AddressSchema,
    value: optional(UintSchema),
    input: optional(BytesSchema),
  }),
})
export type CalculateGasZksyncParameters = InferOutput<
  typeof CalculateGasZksyncParametersSchema
>

export const CalculateGasZksyncFeesSchema = object({
  kind: literal("zksync"),
  gas_limit: UintSchema,
  gas_per_pubdata_limit: UintSchema,
  max_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
})
export type CalculateGasZksyncFees = InferOutput<
  typeof CalculateGasZksyncFeesSchema
>

export function calculate_gas_zksync(
  _parameters: CalculateGasZksyncParameters,
): Readable<CalculateGasZksyncFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<CalculateGasZksyncFees> => {
    const parameters = parse(
      CalculateGasZksyncParametersSchema,
      _parameters,
    )
    const fee = await zks_estimate_fee(parameters.tx)(
      resolved,
    )
    return parse(CalculateGasZksyncFeesSchema, {
      kind: "zksync",
      ...fee,
    })
  }
}
