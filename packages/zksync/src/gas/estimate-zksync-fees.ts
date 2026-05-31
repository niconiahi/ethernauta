// Coarse zkSync gas estimator. Forwards the user's tx to
// `zks_estimateFee` and re-shapes the four-field response into the
// public `ZksyncFees` schema. zkSync's pubdata pricing is its own
// dimension that doesn't map onto Ethereum's 1559 fee model, so we
// trust the node's estimator rather than composing primitives.

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
import { object, optional, parse } from "valibot"

import { zks_estimate_fee } from "./zks-estimate-fee"

export const EstimateZksyncFeesParametersSchema = object({
  tx: object({
    from: optional(AddressSchema),
    to: AddressSchema,
    value: optional(UintSchema),
    input: optional(BytesSchema),
  }),
})
export type EstimateZksyncFeesParameters = InferOutput<
  typeof EstimateZksyncFeesParametersSchema
>

export const ZksyncFeesSchema = object({
  gas_limit: UintSchema,
  gas_per_pubdata_limit: UintSchema,
  max_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
})
export type ZksyncFees = InferOutput<
  typeof ZksyncFeesSchema
>

export function estimate_zksync_fees(
  _parameters: EstimateZksyncFeesParameters,
): Readable<ZksyncFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<ZksyncFees> => {
    const parameters = parse(
      EstimateZksyncFeesParametersSchema,
      _parameters,
    )
    const fee = await zks_estimate_fee(parameters.tx)(
      resolved,
    )
    return parse(ZksyncFeesSchema, fee)
  }
}
