// https://specs.optimism.io/protocol/deposits.html#the-deposited-transaction-type
//
// User-deposit envelope encoding (tx type 0x7e):
//
//   0x7e || rlp([
//     source_hash,    // bytes32
//     from,           // address
//     to | "",        // address (empty for creation)
//     mint,           // uint256, minimal big-endian
//     value,          // uint256
//     gas,            // uint64
//     is_system_tx,   // bool (0 or 1)
//     data,           // bytes
//   ])
//
// `compute_l2_deposit_tx_hash` is the integration helper used
// by the bridge `get_status` flow — it takes the raw
// `TransactionDeposited` event payload (the `DepositLog`
// shape: `from`, `to`, `opaqueData`, plus the L1 block hash
// and log index that scope the event), reconstructs the full
// envelope by computing the source hash and slicing the
// version-0 `opaqueData` layout (`mint(32) || value(32) ||
// gas(8) || isCreation(1) || data(...)`), encodes via
// `encode_deposit_tx`, and keccaks. op-geth keys the L2
// deposit receipt by this hash.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  bigint_to_hex,
  bytes_to_hex,
  hex_to_bigint,
  hex_to_bytes,
  rlp_encode,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import {
  type DepositTx,
  DepositTxSchema,
} from "../core/deposit-tx"
import { compute_deposit_source_hash } from "./compute-deposit-source-hash"

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

export function encode_deposit_tx(
  tx: DepositTx,
): Uint8Array {
  const to_field =
    tx.to === null ? new Uint8Array(0) : hex_to_bytes(tx.to)
  const rlp_encoded = rlp_encode([
    hex_to_bytes(tx.source_hash),
    hex_to_bytes(tx.from),
    to_field,
    hex_to_bigint(tx.mint),
    hex_to_bigint(tx.value),
    hex_to_bigint(tx.gas),
    tx.is_system_tx ? 1n : 0n,
    hex_to_bytes(tx.data),
  ])
  const out = new Uint8Array(1 + rlp_encoded.length)
  out[0] = DEPOSIT_TX_TYPE
  out.set(rlp_encoded, 1)
  return out
}

export function compute_l2_deposit_tx_hash(
  log: DepositLog,
): Hash32 {
  const opaque = hex_to_bytes(log.opaque_data)
  if (opaque.length < OPAQUE_DATA_PREFIX_LENGTH) {
    throw new Error(
      "compute_l2_deposit_tx_hash: opaqueData shorter than 73-byte prefix",
    )
  }
  const mint = bytes_to_bigint_be(opaque.subarray(0, 32))
  const value = bytes_to_bigint_be(opaque.subarray(32, 64))
  const gas = bytes_to_bigint_be(opaque.subarray(64, 72))
  const is_creation_byte = opaque[72]
  const is_creation =
    is_creation_byte !== undefined && is_creation_byte !== 0
  const data = opaque.subarray(73)
  const source_hash = compute_deposit_source_hash({
    l1_block_hash: log.l1_block_hash,
    l1_log_index: log.log_index,
  })
  const tx = parse(DepositTxSchema, {
    source_hash,
    from: log.from,
    to: is_creation ? null : log.to,
    mint: parse(UintSchema, bigint_to_hex(mint)),
    value: parse(UintSchema, bigint_to_hex(value)),
    gas: parse(UintSchema, bigint_to_hex(gas)),
    is_system_tx: false,
    data: parse(BytesSchema, bytes_to_hex(data)),
  })
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(encode_deposit_tx(tx))),
  )
}

function bytes_to_bigint_be(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}
