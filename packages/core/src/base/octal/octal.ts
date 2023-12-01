import { Input, special } from "valibot";

// base 8
function isOctal(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{16}$/.test(input);
}
export const octalSchema = special<`0x${string}`>(isOctal)
export type Octal = Input<typeof octalSchema>
