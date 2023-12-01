import { Input, safeParse, special } from "valibot";
import { hexadecimalSchema } from "@ethernauta/core";

function isAddress(input: unknown) {
  return safeParse(hexadecimalSchema, input).success
}
export const addressSchema = special<`0x${string}`>(isAddress)
export type Address = Input<typeof addressSchema>
