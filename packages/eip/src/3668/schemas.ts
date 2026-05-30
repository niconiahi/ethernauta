// https://eips.ethereum.org/EIPS/eip-3668
//
// Schemas for the CCIP-Read protocol shapes:
//   - `OffchainLookupErrorSchema` — the decoded fields of the
//     custom error a CCIP-aware contract reverts with.
//   - `CcipResponseSchema` — the JSON body the off-chain gateway
//     returns (`{ data: <hex bytes> }`).

import {
  AddressSchema,
  BytesSchema,
  Bytes4Schema,
} from "@ethernauta/core"
import {
  type InferOutput,
  array,
  object,
  string,
} from "valibot"

export const OffchainLookupErrorSchema = object({
  sender: AddressSchema,
  urls: array(string()),
  callData: BytesSchema,
  callbackFunction: Bytes4Schema,
  extraData: BytesSchema,
})
export type OffchainLookupError = InferOutput<
  typeof OffchainLookupErrorSchema
>

export const CcipResponseSchema = object({
  data: BytesSchema,
})
export type CcipResponse = InferOutput<
  typeof CcipResponseSchema
>
