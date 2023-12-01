import { Input, special } from "valibot";

function isBase256(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{512}$/.test(input);
}
export const base256Schema = special<`0x${string}`>(isBase256)
export type Base256 = Input<typeof base256Schema>
