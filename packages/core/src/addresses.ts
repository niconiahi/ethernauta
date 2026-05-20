import type { InferOutput } from "valibot"
import { array } from "valibot"
import { addressSchema } from "./address"

export const addressesSchema = array(addressSchema)
export type Addresses = InferOutput<typeof addressesSchema>
