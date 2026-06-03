// L2→L1 withdraw payload extraction for Arbitrum bridges.
//
// Given an L2 transaction receipt (the one returned by
// `start_withdraw_*` for an Arbitrum withdrawal), scan its
// logs for `ArbSys.L2ToL1Tx`, decode the event, and reshape
// the fields into the `WithdrawalTransaction` payload
// `fetch_message_proof` + `execute_withdraw` consume.
//
// Closes the withdraw demo's "paste these fields from the
// block explorer" idiom — the dapp now obtains the
// withdrawal payload directly from the L2 receipt it already
// had to call `eth_getTransactionReceipt` for.
//
// Spec — https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging.

import {
  address as address_codec,
  bytes as bytes_codec,
  decode_event_log,
  event_topic_hash,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { ARB_SYS_ADDRESS } from "../precompiles/arb-sys"
import {
  type WithdrawalTransaction,
  WithdrawalTransactionSchema,
} from "./message-proof"

export const L2ToL1TxLogSchema = object({
  caller: AddressSchema,
  destination: AddressSchema,
  hash: Bytes32Schema,
  position: Uint64Schema,
  arb_block_num: Uint256Schema,
  eth_block_num: Uint256Schema,
  timestamp: Uint256Schema,
  callvalue: Uint256Schema,
  data: BytesSchema,
})
export type L2ToL1TxLog = InferOutput<
  typeof L2ToL1TxLogSchema
>

const L2_TO_L1_TX_CODECS = [
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
] as const
const L2_TO_L1_TX_INDEXED = [
  false,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
]

export function decode_l2_to_l1_tx_log(
  log: Log,
): L2ToL1TxLog | null {
  if (
    log.address.toLowerCase() !==
    ARB_SYS_ADDRESS.toLowerCase()
  ) {
    return null
  }
  const topic0 = event_topic_hash(
    "L2ToL1Tx",
    L2_TO_L1_TX_CODECS,
  )
  if (log.topics[0] !== topic0) return null
  const decoded = decode_event_log({
    name: "L2ToL1Tx",
    args: L2_TO_L1_TX_CODECS,
    indexed: L2_TO_L1_TX_INDEXED,
    topics: log.topics,
    data: log.data,
  })
  const [
    caller,
    destination,
    hash,
    position,
    arb_block_num,
    eth_block_num,
    timestamp,
    callvalue,
    data,
  ] = decoded.args
  const position_u256 = parse(Uint256Schema, position)
  const position_u64 = parse(
    Uint64Schema,
    bigint_to_hex(hex_to_bigint(position_u256)),
  )
  return parse(L2ToL1TxLogSchema, {
    caller,
    destination,
    hash,
    position: position_u64,
    arb_block_num,
    eth_block_num,
    timestamp,
    callvalue,
    data,
  })
}

export function decode_l2_to_l1_tx_from_receipt(input: {
  logs: readonly Log[]
}): WithdrawalTransaction | null {
  for (const log of input.logs) {
    const decoded = decode_l2_to_l1_tx_log(log)
    if (decoded !== null) {
      return parse(WithdrawalTransactionSchema, {
        position: decoded.position,
        l2Sender: decoded.caller,
        to: decoded.destination,
        l2Block: decoded.arb_block_num,
        l1Block: decoded.eth_block_num,
        l2Timestamp: decoded.timestamp,
        value: decoded.callvalue,
        data: decoded.data,
      })
    }
  }
  return null
}
