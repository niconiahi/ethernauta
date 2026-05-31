// https://github.com/OffchainLabs/nitro/blob/master/execution/gethexec/api.go#L46
//
// Mirrors:
//
//   type NumberAndBlockMetadata struct {
//       BlockNumber uint64        `json:"blockNumber"`
//       RawMetadata hexutil.Bytes `json:"rawMetadata"`
//   }
//
// `BlockNumber` is a plain `uint64` (geth encodes it as a JSON
// number); some operators wrap it in `hexutil.Uint64` and emit a
// hex string. `RpcNumberSchema` accepts both wire shapes and
// normalizes to the canonical `Uint` brand; a piped transform
// re-parses through `Uint64Schema` to narrow to the size brand.

import { BytesSchema, Uint64Schema } from "@ethernauta/core"
import { RpcNumberSchema } from "@ethernauta/transport"
import {
  type InferOutput,
  object,
  parse,
  pipe,
  transform,
} from "valibot"

export const NumberAndBlockMetadataSchema = object({
  blockNumber: pipe(
    RpcNumberSchema,
    transform((u) => parse(Uint64Schema, u)),
  ),
  rawMetadata: BytesSchema,
})
export type NumberAndBlockMetadata = InferOutput<
  typeof NumberAndBlockMetadataSchema
>
