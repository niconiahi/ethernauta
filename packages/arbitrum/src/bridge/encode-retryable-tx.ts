// L2 retryable ticket hash derivation for Arbitrum bridges.
//
// Given the L1 `InboxMessageDelivered` event emitted by `Inbox`
// when a retryable ticket is created — the indexed `messageNum`
// plus the packed `data` payload — the raw L1 `msg.sender`
// (= L1 receipt's `from` for direct EOA calls), the L1 block's
// `baseFeePerGas` (= the Bridge's `MessageDelivered.baseFeeL1`
// for ETH-native rollups), and the destination L2 chain ID,
// recompute the L2 submit-tx hash (type 0x69). The L2 hash is
// what arb-geth uses to key the receipt of the derived L2
// retryable, so `get_status` can fetch it via
// `eth_getTransactionReceipt` on the destination reader to
// distinguish `succeeded_l2` / `failed_l2` after the L1
// deposit lands.
//
// Spec: ported verbatim from `@arbitrum/sdk` v4's
// `ParentToChildMessage.calculateSubmitRetryableId`:
//
//   submit_tx_hash = keccak256(
//     0x69 || rlp([
//       chainId, pad32(messageNum), sender, parentBaseFee,
//       l1Value, maxFeePerGas, gasLimit, isCreate ? empty : to,
//       l2CallValue, callValueRefundAddress, maxSubmissionCost,
//       excessFeeRefundAddress, data
//     ])
//   )
//
// `sender` is the raw L1 `msg.sender` — NOT aliased. ArbOS
// applies the L1→L2 alias on the L2 side when materializing the
// type-0x69 transaction context; the hash that keys the L2
// receipt is computed against the raw L1 sender per the SDK.
//
// Shortcut: we read the L1 sender from `receipt.from` and the
// base fee from `eth_getBlockByHash(receipt.blockHash).baseFeePerGas`
// rather than vendoring the Bridge's `MessageDelivered` event.
// Both shortcuts hold for direct EOA → Inbox calls on ETH-native
// rollups. A router/multisig/smart-account intermediary on L1
// breaks the `receipt.from` shortcut; a custom-gas-token Orbit
// chain (`ERC20Bridge._baseFeeToReport() = 0`) breaks the
// base-fee shortcut. Tracked in plan 06's deferred-items list.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Hash32Schema,
  Uint256Schema,
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

export const RetryableLogSchema = object({
  sender: AddressSchema,
  message_num: Uint256Schema,
  data: BytesSchema,
  destination_chain_id: Uint256Schema,
  l1_base_fee: Uint256Schema,
})
export type RetryableLog = InferOutput<
  typeof RetryableLogSchema
>

const RETRYABLE_TX_TYPE = 0x69
const PACKED_PREFIX_LENGTH = 9 * 32
const ADDRESS_OFFSET_IN_WORD = 12

function bytes_to_bigint_be(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}

function read_word(
  buf: Uint8Array,
  offset: number,
): bigint {
  return bytes_to_bigint_be(
    buf.subarray(offset, offset + 32),
  )
}

function read_address_word(
  buf: Uint8Array,
  offset: number,
): Uint8Array {
  return buf.subarray(
    offset + ADDRESS_OFFSET_IN_WORD,
    offset + 32,
  )
}

function pad32(value: bigint): Uint8Array {
  const out = new Uint8Array(32)
  let cursor = 32
  let remaining = value
  while (remaining > 0n && cursor > 0) {
    cursor -= 1
    out[cursor] = Number(remaining & 0xffn)
    remaining >>= 8n
  }
  return out
}

export function compute_l2_retryable_tx_hash(
  _input: RetryableLog,
): Hash32 {
  const input = parse(RetryableLogSchema, _input)
  const data_bytes = hex_to_bytes(input.data)
  if (data_bytes.length < PACKED_PREFIX_LENGTH) {
    throw new Error(
      "compute_l2_retryable_tx_hash: InboxMessageDelivered.data shorter than 288-byte packed prefix",
    )
  }
  const to_word = data_bytes.subarray(0, 32)
  const l2_call_value = read_word(data_bytes, 32)
  const l1_value = read_word(data_bytes, 64)
  const max_submission_cost = read_word(data_bytes, 96)
  const excess_fee_refund = read_address_word(
    data_bytes,
    128,
  )
  const call_value_refund = read_address_word(
    data_bytes,
    160,
  )
  const gas_limit = read_word(data_bytes, 192)
  const max_fee_per_gas = read_word(data_bytes, 224)
  const inner_data_length = Number(
    read_word(data_bytes, 256),
  )
  const inner_data = data_bytes.subarray(
    PACKED_PREFIX_LENGTH,
    PACKED_PREFIX_LENGTH + inner_data_length,
  )
  const dest = to_word.subarray(ADDRESS_OFFSET_IN_WORD, 32)
  const is_create = to_word.every((byte) => byte === 0)
  const chain_id = hex_to_bigint(input.destination_chain_id)
  const message_num = hex_to_bigint(input.message_num)
  const parent_base_fee = hex_to_bigint(input.l1_base_fee)
  const sender_bytes = hex_to_bytes(input.sender)
  const rlp_payload = rlp_encode([
    chain_id,
    pad32(message_num),
    sender_bytes,
    parent_base_fee,
    l1_value,
    max_fee_per_gas,
    gas_limit,
    is_create ? new Uint8Array(0) : dest,
    l2_call_value,
    call_value_refund,
    max_submission_cost,
    excess_fee_refund,
    inner_data,
  ])
  const prefixed = new Uint8Array(1 + rlp_payload.length)
  prefixed[0] = RETRYABLE_TX_TYPE
  prefixed.set(rlp_payload, 1)
  return parse(
    Hash32Schema,
    bytes_to_hex(keccak_256(prefixed)),
  )
}
