import { Input, special } from "valibot";

function isHexadecimal(input: unknown)  {
  return typeof input === 'string' && /^0x[a-fA-F0-9]+$/.test(input);
}
export const hexadecimalSchema = special<`0x${string}`>(isHexadecimal)
export type Hexadecimal = Input<typeof hexadecimalSchema>

export function hexadecimalToNumber(hexadecimal: Hexadecimal): number {
  return parseInt(hexadecimal, 16);
}
