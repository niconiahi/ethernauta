// https://github.com/OffchainLabs/nitro/blob/master/timeboost/types.go#L160
//
// Mirrors:
//
//   type JsonExpressLaneSubmission struct {
//     ChainId                *hexutil.Big                       `json:"chainId"`
//     Round                  hexutil.Uint64                     `json:"round"`
//     AuctionContractAddress common.Address                     `json:"auctionContractAddress"`
//     Transaction            hexutil.Bytes                      `json:"transaction"`
//     Options                *arbitrum_types.ConditionalOptions `json:"options"`
//     SequenceNumber         hexutil.Uint64                     `json:"sequenceNumber"`
//     Signature              hexutil.Bytes                      `json:"signature"`
//   }
//
// `Transaction` is the raw RLP-encoded signed L2 transaction (same
// shape `eth_sendRawTransaction` takes). `Options` is nullable.
// `ChainId` uses `hexutil.Big` (arbitrary-precision unsigned); the
// generic `UintSchema` covers it. Round + SequenceNumber are sized
// `uint64` and parse through `Uint64Schema`.

import {
  AddressSchema,
  BytesSchema,
  Uint64Schema,
  UintSchema,
} from "@ethernauta/core"
import { type InferOutput, nullable, object } from "valibot"
import { ConditionalOptionsSchema } from "./conditional-options"

export const JsonExpressLaneSubmissionSchema = object({
  chainId: UintSchema,
  round: Uint64Schema,
  auctionContractAddress: AddressSchema,
  transaction: BytesSchema,
  options: nullable(ConditionalOptionsSchema),
  sequenceNumber: Uint64Schema,
  signature: BytesSchema,
})
export type JsonExpressLaneSubmission = InferOutput<
  typeof JsonExpressLaneSubmissionSchema
>
