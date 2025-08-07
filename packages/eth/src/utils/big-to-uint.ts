import { parse } from "valibot"
import { uintSchema, type Uint } from "../core"

export function bigToUint(big: bigint): Uint {
  return parse(uintSchema, `0x${big.toString(16)}`)
}
