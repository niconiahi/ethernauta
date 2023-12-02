import { Input, special } from "valibot";

function isBytes48(input: unknown) {
  return typeof input === 'string' && /^0x[0-9a-f]{96}$/.test(input);
}
export const bytes48Schema = special<`0x${string}`>(isBytes48)
export type Bytes48 = Input<typeof bytes48Schema>
