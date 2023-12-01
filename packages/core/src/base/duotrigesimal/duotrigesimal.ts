import { Input, special } from "valibot";

// base 32
function isDuotrigesimal(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{64}$/.test(input);
}
export const duotrigesimalSchema = special<`0x${string}`>(isDuotrigesimal)
export type Duotrigesimal = Input<typeof duotrigesimalSchema>
