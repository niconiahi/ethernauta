// https://docs.ens.domains/ensip/1

import {
  type Bytes32,
  bytes32Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"

export function namehash(_name: string): Bytes32 {
  let node = new Uint8Array(32)
  if (_name.length === 0) {
    return parse(bytes32Schema, bytes_to_hex(node))
  }
  const labels = _name.split(".")
  for (const label of labels.slice().reverse()) {
    const encoded = new TextEncoder().encode(label)
    const label_hash = keccak_256(new Uint8Array(encoded))
    const concat = new Uint8Array(64)
    concat.set(node, 0)
    concat.set(label_hash, 32)
    node = new Uint8Array(keccak_256(concat))
  }
  return parse(bytes32Schema, bytes_to_hex(node))
}

// Reverse-lookup node: keccak256-derived from a
// "<addr_no_prefix_lowercase>.addr.reverse" label tree.
export function reverse_namehash(
  _address: `0x${string}`,
): Bytes32 {
  const lower = _address.slice(2).toLowerCase()
  return namehash(`${lower}.addr.reverse`)
}
