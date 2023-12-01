import { Input, special } from "valibot";

// base 256
function isOctocentihexagesimal(input: unknown) {
  return typeof input === 'string' && /^0x[a-fA-F0-9]{512}$/.test(input);
}
export const octocentihexagesimalSchema = special<`0x${string}`>(isOctocentihexagesimal)
export type Octocentihexagesimal = Input<typeof octocentihexagesimalSchema>
