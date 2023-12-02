import { Input, special } from "valibot";

function isHash32(input: unknown) {
  return typeof input === 'string' && /^0x[0-9a-f]{64}$/.test(input);
}
export const hash32Schema = special<`0x${string}`>(isHash32)
export type Hash32 = Input<typeof hash32Schema>
