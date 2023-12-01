import { Input, special } from "valibot";

function isBase32(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{64}$/.test(input);
}
export const base32Schema = special<`0x${string}`>(isBase32)
export type Base32 = Input<typeof base32Schema>
