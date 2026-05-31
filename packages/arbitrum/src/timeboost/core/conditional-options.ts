// https://github.com/OffchainLabs/go-ethereum/blob/master/arbitrum_types/txoptions.go
//
// Mirrors:
//
//   type ConditionalOptions struct {
//     KnownAccounts  map[common.Address]RootHashOrSlots `json:"knownAccounts"`
//     BlockNumberMin *math.HexOrDecimal64               `json:"blockNumberMin,omitempty"`
//     BlockNumberMax *math.HexOrDecimal64               `json:"blockNumberMax,omitempty"`
//     TimestampMin   *math.HexOrDecimal64               `json:"timestampMin,omitempty"`
//     TimestampMax   *math.HexOrDecimal64               `json:"timestampMax,omitempty"`
//   }
//
//   type RootHashOrSlots struct {
//     RootHash  *common.Hash                     // shape A: bare hash string
//     SlotValue map[common.Hash]common.Hash      // shape B: slot → value map
//   }
//
// The RootHashOrSlots field unmarshals from JSON via a custom
// UnmarshalJSON that tries the hash form first and falls back to
// the slot-map form. We mirror that with a Valibot `union`.

import {
  AddressSchema,
  Bytes32Schema,
  Hash32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import { RpcNumberSchema } from "@ethernauta/transport"
import {
  type InferOutput,
  object,
  optional,
  parse,
  pipe,
  record,
  transform,
  union,
} from "valibot"

const RootHashOrSlotsSchema = union([
  Hash32Schema,
  record(Bytes32Schema, Bytes32Schema),
])

const HexOrDecimal64Schema = pipe(
  RpcNumberSchema,
  transform((u) => parse(Uint64Schema, u)),
)

export const ConditionalOptionsSchema = object({
  knownAccounts: record(
    AddressSchema,
    RootHashOrSlotsSchema,
  ),
  blockNumberMin: optional(HexOrDecimal64Schema),
  blockNumberMax: optional(HexOrDecimal64Schema),
  timestampMin: optional(HexOrDecimal64Schema),
  timestampMax: optional(HexOrDecimal64Schema),
})
export type ConditionalOptions = InferOutput<
  typeof ConditionalOptionsSchema
>
