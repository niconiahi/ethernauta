import type { Uint } from "../../base"

export function uintToBig(uint: Uint): bigint {
  return BigInt(uint.toLocaleLowerCase())
}
