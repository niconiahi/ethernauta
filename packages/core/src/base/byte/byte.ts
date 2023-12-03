import { Input, special } from "valibot";

function isByte(input: unknown) {
  return typeof input === 'string' && /^0x([0-9,a-f,A-F]?){1,2}$/.test(input);
}
export const byteSchema = special<`0x${string}`>(isByte)
export type Byte = Input<typeof byteSchema>