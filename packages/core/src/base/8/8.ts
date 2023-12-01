import { Input, special } from "valibot";

function isBase8(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{16}$/.test(input);
}
export const base8Schema = special<`0x${string}`>(isBase8)
export type Base8 = Input<typeof base8Schema>
