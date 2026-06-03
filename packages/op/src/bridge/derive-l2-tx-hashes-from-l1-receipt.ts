// https://specs.optimism.io/protocol/deposits.html#deposit-receipt
//
// Given an L1 receipt that includes one or more
// `TransactionDeposited` events (emitted by `OptimismPortal`
// when a deposit is initiated), derive the L2 deposit
// transaction hashes that op-geth will key the resulting
// receipts by. The plural shape is the honest one — a single
// L1 transaction can fan out into multiple deposits via
// multicall, so a singular helper would be a footgun.
//
// Filtering is by event topic alone (`TransactionDeposited`
// is a unique signature in practice); this matches viem's
// `getL2TransactionHashes` and keeps the function pure —
// callers that need address-scoping can pre-filter
// `l1_receipt.logs` before invoking.

import {
  address as address_codec,
  bytes as bytes_codec,
  decode_event_log,
  event_topic_hash,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import type { Hash32 } from "@ethernauta/core"
import type { ReceiptInfo } from "@ethernauta/eth"
import { parse } from "valibot"

import {
  compute_l2_deposit_tx_hash,
  DepositLogSchema,
} from "./encode-deposit-tx"

const TRANSACTION_DEPOSITED_CODECS = [
  address_codec(),
  address_codec(),
  uint256_codec(),
  bytes_codec(),
] as const
const TRANSACTION_DEPOSITED_INDEXED = [
  true,
  true,
  true,
  false,
]

export function derive_l2_tx_hashes_from_l1_receipt(input: {
  l1_receipt: ReceiptInfo
}): Hash32[] {
  const topic0 = event_topic_hash(
    "TransactionDeposited",
    TRANSACTION_DEPOSITED_CODECS,
  )
  const hashes: Hash32[] = []
  for (const log of input.l1_receipt.logs) {
    if (log.topics[0] !== topic0) continue
    const decoded = decode_event_log({
      name: "TransactionDeposited",
      args: TRANSACTION_DEPOSITED_CODECS,
      indexed: TRANSACTION_DEPOSITED_INDEXED,
      topics: log.topics,
      data: log.data,
    })
    const [from, to, , opaque_data] = decoded.args
    const deposit_log = parse(DepositLogSchema, {
      from,
      to,
      opaque_data,
      l1_block_hash: log.blockHash,
      log_index: log.logIndex,
    })
    hashes.push(compute_l2_deposit_tx_hash(deposit_log))
  }
  return hashes
}
