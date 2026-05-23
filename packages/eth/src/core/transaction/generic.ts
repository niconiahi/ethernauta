import {
  addressSchema,
  byteSchema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import { ethernautaContextSchema } from "@ethernauta/transport"
import { array, nullable, object, optional } from "valibot"
import { accessListSchema } from "../transaction"

/**
 * Generic transaction object applicable to all types.
 * Per execution-apis, every field is optional — callers
 * provide only what they want to pin, the endpoint
 * (wallet / managed-key node) fills the rest.
 *
 * `_ethernauta` is a namespaced sidecar field other 1193
 * wallets silently strip. Ethernauta reads its `function`
 * sub-field to render decoded calldata in the sign view.
 */
export const genericTransactionSchema = object({
  type: optional(byteSchema),
  nonce: optional(uintSchema),
  to: optional(nullable(addressSchema)),
  from: optional(addressSchema),
  gas: optional(uintSchema),
  value: optional(uintSchema),
  input: optional(bytesSchema),
  gasPrice: optional(uintSchema),
  maxPriorityFeePerGas: optional(uintSchema),
  maxFeePerGas: optional(uintSchema),
  maxFeePerBlobGas: optional(uintSchema),
  accessList: optional(accessListSchema),
  blobVersionedHashes: optional(array(hash32Schema)),
  blobs: optional(array(bytesSchema)),
  chainId: optional(uintSchema),
  _ethernauta: optional(ethernautaContextSchema),
})
