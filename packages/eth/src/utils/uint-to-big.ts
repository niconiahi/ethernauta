import type { Uint } from "../core"

export function uintToBig(uint: Uint): bigint {
  return BigInt(uint.toLocaleLowerCase())
}
