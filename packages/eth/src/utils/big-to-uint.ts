import { parse } from "valibot"
import { type Uint, uintSchema } from "../core"

export function bigToUint(big: bigint): Uint {
  return parse(uintSchema, `0x${big.toString(16)}`)
}
