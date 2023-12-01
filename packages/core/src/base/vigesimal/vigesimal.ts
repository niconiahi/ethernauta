import { Input, special } from "valibot";

// base 20
function isVigesimal(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{40}$/.test(input);
}
export const vigesimalSchema = special<`0x${string}`>(isVigesimal)
export type Vigesimal = Input<typeof vigesimalSchema>

export function vigesimalToNumber(vigesimal: Vigesimal): number {
  return parseInt(vigesimal, 20);
}
