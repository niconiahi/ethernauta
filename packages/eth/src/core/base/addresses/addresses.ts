import type { Input } from "valibot"
import { array } from "valibot"

import { addressSchema } from "../address"

export const addressesSchema = array(addressSchema)
export type Addresses = Input<typeof addressesSchema>
