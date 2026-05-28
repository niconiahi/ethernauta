import type { InferOutput } from "valibot"
import { array } from "valibot"
import { AddressSchema } from "./address"

export const AddressesSchema = array(AddressSchema)
export type Addresses = InferOutput<typeof AddressesSchema>
