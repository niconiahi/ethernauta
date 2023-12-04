import type { Input } from 'valibot'
import { special } from 'valibot'

function isUint(input: unknown) {
  return typeof input === 'string' && /^0x([1-9a-f]+[0-9a-f]*|0)$/.test(input)
}
export const uintSchema = special<`0x${string}`>(isUint)
export type Uint = Input<typeof uintSchema>

export function uintToNumber(uint: Uint): number {
  return Number.parseInt(uint, 16)
}
