import { Input, special } from "valibot";

// base 16
function isBase16(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{32}$/.test(input);
}
export const base16Schema = special<`0x${string}`>(isBase16)
export type Base16 = Input<typeof base16Schema>

export function base16ToNumber(base16: Base16): number {
  return parseInt(base16, 16);
}
