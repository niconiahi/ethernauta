// https://eips.ethereum.org/EIPS/eip-2930

import {
  addressSchema,
  hash32Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

export const accessListEntrySchema = object({
  address: addressSchema,
  storageKeys: array(hash32Schema),
})
export type AccessListEntry = InferOutput<
  typeof accessListEntrySchema
>

export const accessListSchema = array(accessListEntrySchema)
export type AccessList = InferOutput<
  typeof accessListSchema
>
