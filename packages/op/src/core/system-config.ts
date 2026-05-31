// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/types.go

import {
  AddressSchema,
  Bytes8Schema,
  Bytes32Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  integer,
  minValue,
  number,
  object,
  optional,
  pipe,
} from "valibot"

// uint64 / uint16 fields render as JSON decimal numbers
// (no hexutil alias). eip1559Params (Holocene+),
// operatorFeeParams (Isthmus+), minBaseFee and
// daFootprintGasScalar (Jovian+) are absent on chains
// that have not yet activated the corresponding hardfork.
const Uint64NumberSchema = pipe(
  number(),
  integer(),
  minValue(0),
)

export const SystemConfigSchema = object({
  batcherAddr: AddressSchema,
  overhead: Bytes32Schema,
  scalar: Bytes32Schema,
  gasLimit: Uint64NumberSchema,
  eip1559Params: optional(Bytes8Schema),
  operatorFeeParams: optional(Bytes32Schema),
  minBaseFee: optional(Uint64NumberSchema),
  daFootprintGasScalar: optional(Uint64NumberSchema),
})
export type SystemConfig = InferOutput<
  typeof SystemConfigSchema
>
