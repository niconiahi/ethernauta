import { Input, special } from "valibot";

function isBase20(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{40}$/.test(input);
}
export const base20Schema = special<`0x${string}`>(isBase20)
export type Base20 = Input<typeof base20Schema>
