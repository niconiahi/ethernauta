// https://eips.ethereum.org/EIPS/eip-7702
// Type-4 (SetCode) transaction. Modeled in JSON-RPC / 1193
// shape — hex-string quantities and bytes, named fields — so
// the same object travels through dapps, the wallet, and
// `eth_getTransactionByHash` responses unchanged. The
// codec turns this into RLP wire bytes only at the
// `eth_sendRawTransaction` boundary.

import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { AccessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { object } from "valibot"
import { AuthorizationListSchema } from "./authorization"

export const Transaction7702UnsignedSchema = object({
  type: ByteSchema,
  chainId: UintSchema,
  nonce: UintSchema,
  gas: UintSchema,
  to: AddressSchema,
  value: UintSchema,
  input: BytesSchema,
  maxPriorityFeePerGas: UintSchema,
  maxFeePerGas: UintSchema,
  accessList: AccessListSchema,
  authorizationList: AuthorizationListSchema,
})
export type Transaction7702Unsigned = InferOutput<
  typeof Transaction7702UnsignedSchema
>

export const Transaction7702SignedSchema = object({
  ...Transaction7702UnsignedSchema.entries,
  yParity: UintSchema,
  r: UintSchema,
  s: UintSchema,
})
export type Transaction7702Signed = InferOutput<
  typeof Transaction7702SignedSchema
>
