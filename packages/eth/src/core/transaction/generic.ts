import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { AccessListSchema } from "@ethernauta/eip/2930"
import { EthernautaContextSchema } from "@ethernauta/transport"
import { array, nullable, object, optional } from "valibot"

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
export const GenericTransactionSchema = object({
  type: optional(ByteSchema),
  nonce: optional(UintSchema),
  to: optional(nullable(AddressSchema)),
  from: optional(AddressSchema),
  gas: optional(UintSchema),
  value: optional(UintSchema),
  input: optional(BytesSchema),
  gasPrice: optional(UintSchema),
  maxPriorityFeePerGas: optional(UintSchema),
  maxFeePerGas: optional(UintSchema),
  maxFeePerBlobGas: optional(UintSchema),
  accessList: optional(AccessListSchema),
  blobVersionedHashes: optional(array(Hash32Schema)),
  blobs: optional(array(BytesSchema)),
  chainId: optional(UintSchema),
  _ethernauta: optional(EthernautaContextSchema),
})
