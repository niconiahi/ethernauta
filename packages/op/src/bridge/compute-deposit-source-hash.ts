// https://specs.optimism.io/protocol/deposits.html#source-hash-computation
//
// The user-deposit `source_hash` binds an L2 deposit
// transaction to the L1 event that produced it:
//
//   source_hash = keccak256(
//     abi.encode(uint256(0), keccak256(abi.encode(l1_block_hash, log_index)))
//   )
//
// The outer `uint256(0)` is the `UserDeposit` domain
// separator; the L1-attributes deposit (one per L2 block,
// system-emitted) uses domain `1` and isn't this helper's
// concern.
//
// Both encodings are bare 32-byte word packing — `abi.encode`
// of two `uint256`s collapses to concatenation — so this
// composes raw with `@noble/hashes` keccak.

import {
  type Hash32,
  Hash32Schema,
  type Uint,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bigint,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"

const UINT256_BYTES = 32

function uint256_be(value: bigint): Uint8Array {
  const out = new Uint8Array(UINT256_BYTES)
  let cursor = UINT256_BYTES
  let remaining = value
  while (remaining > 0n && cursor > 0) {
    cursor -= 1
    out[cursor] = Number(remaining & 0xffn)
    remaining >>= 8n
  }
  return out
}

export function compute_deposit_source_hash(input: {
  l1_block_hash: Hash32
  l1_log_index: Uint
}): Hash32 {
  const inner = new Uint8Array(64)
  inner.set(hex_to_bytes(input.l1_block_hash), 0)
  inner.set(
    uint256_be(hex_to_bigint(input.l1_log_index)),
    32,
  )
  const deposit_id = keccak_256(inner)
  const domain = new Uint8Array(64)
  domain.set(deposit_id, 32)
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(domain)),
  )
}
