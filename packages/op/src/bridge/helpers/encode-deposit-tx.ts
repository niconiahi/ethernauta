// L2 user-deposit hash derivation for OP-stack bridges.
//
// Given the L1 `TransactionDeposited` event emitted by
// `OptimismPortal2` — the indexed `from` / `to` topics plus
// the `opaqueData` payload — and the L1 block hash + log
// index that scope the event, recompute (1) the user-deposit
// source hash and (2) the L2 deposit transaction hash
// (type 0x7e). The L2 deposit hash is what op-geth uses to
// key the receipt of the derived L2 deposit, so `get_status`
// can fetch it via `eth_getTransactionReceipt` on the
// destination reader to distinguish `succeeded_l2` /
// `failed_l2` after the L1 deposit lands.
//
// Spec — https://specs.optimism.io/protocol/deposits.html:
//
//   source_hash = keccak256(
//     abi.encode(uint256(0), keccak256(abi.encode(l1_block_hash, log_index)))
//   )
//
//   opaqueData = mint(32) || value(32) || gas(8) ||
//                isCreation(1) || data(...)
//
//   tx_hash = keccak256(0x7e || rlp([
//     source_hash,                       // bytes32
//     from,                              // address
//     isCreation ? empty : to,           // address or empty
//     mint, value, gas,                  // big-endian minimal
//     0,                                 // isSystemTransaction
//     data,                              // bytes
//   ]))
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bigint,
  hex_to_bytes,
  rlp_encode,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

export const DepositLogSchema = object({
  from: AddressSchema,
  to: AddressSchema,
  opaque_data: BytesSchema,
  l1_block_hash: Hash32Schema,
  log_index: UintSchema,
})
export type DepositLog = InferOutput<
  typeof DepositLogSchema
>

const OPAQUE_DATA_PREFIX_LENGTH = 73
const DEPOSIT_TX_TYPE = 0x7e
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

function bytes_to_bigint_be(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}

function compute_user_deposit_source_hash(input: {
  l1_block_hash: Hash32
  log_index: bigint
}): Hash32 {
  const inner = new Uint8Array(64)
  inner.set(hex_to_bytes(input.l1_block_hash), 0)
  inner.set(uint256_be(input.log_index), 32)
  const deposit_id = keccak_256(inner)
  const domain = new Uint8Array(64)
  // first 32 bytes: uint256(0) — already zero (UserDeposit domain)
  domain.set(deposit_id, 32)
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(domain)),
  )
}

export function compute_l2_deposit_tx_hash(
  input: DepositLog,
): Hash32 {
  const opaque = hex_to_bytes(input.opaque_data)
  if (opaque.length < OPAQUE_DATA_PREFIX_LENGTH) {
    throw new Error(
      "compute_l2_deposit_tx_hash: opaqueData shorter than 73-byte prefix",
    )
  }
  const mint = bytes_to_bigint_be(opaque.subarray(0, 32))
  const value = bytes_to_bigint_be(opaque.subarray(32, 64))
  const gas_limit = bytes_to_bigint_be(
    opaque.subarray(64, 72),
  )
  const is_creation_byte = opaque[72]
  const is_creation =
    is_creation_byte !== undefined && is_creation_byte !== 0
  const data = opaque.subarray(73)
  const source_hash = compute_user_deposit_source_hash({
    l1_block_hash: input.l1_block_hash,
    log_index: hex_to_bigint(input.log_index),
  })
  const to_field = is_creation
    ? new Uint8Array(0)
    : hex_to_bytes(input.to)
  const rlp_encoded = rlp_encode([
    hex_to_bytes(source_hash),
    hex_to_bytes(input.from),
    to_field,
    mint,
    value,
    gas_limit,
    0n,
    data,
  ])
  const prefixed = new Uint8Array(1 + rlp_encoded.length)
  prefixed[0] = DEPOSIT_TX_TYPE
  prefixed.set(rlp_encoded, 1)
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(prefixed)),
  )
}
