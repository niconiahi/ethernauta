import { Input, special } from "valibot";

function isBytes65(input: unknown) {
  return typeof input === 'string' && /^0x[0-9a-f]{512}$/.test(input);
}
export const bytes65Schema = special<`0x${string}`>(isBytes65)
export type Bytes65 = Input<typeof bytes65Schema>