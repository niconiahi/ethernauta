// https://eips.ethereum.org/EIPS/eip-7702
// Type-4 (SetCode) transaction. Modeled in JSON-RPC / 1193
// shape — hex-string quantities and bytes, named fields — so
// the same object travels through dapps, the wallet, and
// `eth_getTransactionByHash` responses unchanged. The
// codec turns this into RLP wire bytes only at the
// `eth_sendRawTransaction` boundary.

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import { accessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { object } from "valibot"
import { authorizationListSchema } from "./authorization"

export const transaction7702UnsignedSchema = object({
  type: byteSchema,
  chainId: uintSchema,
  nonce: uintSchema,
  gas: uintSchema,
  to: addressSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  accessList: accessListSchema,
  authorizationList: authorizationListSchema,
})
export type Transaction7702Unsigned = InferOutput<
  typeof transaction7702UnsignedSchema
>

export const transaction7702SignedSchema = object({
  ...transaction7702UnsignedSchema.entries,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Transaction7702Signed = InferOutput<
  typeof transaction7702SignedSchema
>
