// https://eips.ethereum.org/EIPS/eip-2930

import {
  AddressSchema,
  Hash32Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

export const AccessListEntrySchema = object({
  address: AddressSchema,
  storageKeys: array(Hash32Schema),
})
export type AccessListEntry = InferOutput<
  typeof AccessListEntrySchema
>

export const AccessListSchema = array(AccessListEntrySchema)
export type AccessList = InferOutput<
  typeof AccessListSchema
>
