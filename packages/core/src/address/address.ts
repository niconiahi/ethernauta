import { Input, special } from "valibot";

function isAddress(input: unknown)  {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{40}$/.test(input);
}
export const addressSchema = special<`0x${string}`>(isAddress)
export type Address = Input<typeof addressSchema>
