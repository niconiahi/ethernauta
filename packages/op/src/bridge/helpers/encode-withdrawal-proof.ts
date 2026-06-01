// Encoding helpers for the OP withdrawal proof bundle.
//
// `compute_withdrawal_hash` mirrors the on-chain
// `Hashing.hashWithdrawal` in op-contracts: the
// `WithdrawalTransaction` tuple is ABI-encoded and
// keccak256'd. The L2ToL1MessagePasser writes
// `sentMessages[hash] = true` at withdraw-initiation
// time; OptimismPortal2 validates the same hash + storage
// slot at prove time.
//
// `compute_sent_messages_storage_slot` returns the slot
// for `sentMessages[hash]`. `sentMessages` is the first
// storage variable declared in L2ToL1MessagePasser, so
// the base slot is `0` and the per-key slot is
// `keccak256(abi.encode(hash, uint256(0)))`.
//
// `OUTPUT_ROOT_VERSION_V0` is the version field
// OptimismPortal2 expects in `OutputRootProof.version` —
// 32 bytes of zero per the L2 output root spec.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address,
  bytes,
  bytes32,
  encode_sequence,
  tuple,
  uint256,
} from "@ethernauta/abi"
import {
  type Bytes32,
  Bytes32Schema,
  type Hash32,
  Hash32Schema,
  type Uint256,
  Uint256Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"

import type { WithdrawalTransaction } from "../op-message-proof"

const WITHDRAWAL_CODECS = [
  tuple({
    nonce: uint256(),
    sender: address(),
    target: address(),
    value: uint256(),
    gasLimit: uint256(),
    data: bytes(),
  }),
] as const

const SENT_MESSAGES_SLOT_CODECS = [
  bytes32(),
  uint256(),
] as const

const SENT_MESSAGES_BASE_SLOT: Uint256 = parse(
  Uint256Schema,
  "0x0",
)

export const OUTPUT_ROOT_VERSION_V0: Bytes32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)

export function compute_withdrawal_hash(
  withdrawal: WithdrawalTransaction,
): Hash32 {
  const encoded = encode_sequence(WITHDRAWAL_CODECS, [
    withdrawal,
  ])
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(encoded)),
  )
}

export function compute_sent_messages_storage_slot(
  withdrawal_hash: Hash32,
): Bytes32 {
  const encoded = encode_sequence(
    SENT_MESSAGES_SLOT_CODECS,
    [withdrawal_hash, SENT_MESSAGES_BASE_SLOT],
  )
  return parse(
    Bytes32Schema,
    bytes_to_hex(keccak_256(encoded)),
  )
}
