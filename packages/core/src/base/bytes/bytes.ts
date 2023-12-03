import { Input, special } from "valibot";

function isBytes(input: unknown) {
  return typeof input === 'string' && /^0x[0-9a-f]*$/.test(input);
}
export const bytesSchema = special<`0x${string}`>(isBytes)
export type Bytes = Input<typeof bytesSchema>