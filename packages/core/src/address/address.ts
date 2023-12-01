import { Input, safeParse, special } from "valibot";
import { base16Schema } from "@ethernauta/core";

function isAddress(input: unknown) {
  return safeParse(base16Schema, input).success
}
export const addressSchema = special<`0x${string}`>(isAddress)
export type Address = Input<typeof addressSchema>
