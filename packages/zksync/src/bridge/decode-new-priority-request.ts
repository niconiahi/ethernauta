// L2 canonical hash extraction for zkSync-family deposits.
//
// Given an L1 transaction receipt for a
// `Bridgehub.requestL2Transaction*` call, scan its logs for
// `NewPriorityRequest`, decode the event, and return the L2
// canonical tx hash zksync-era keys for the L2 receipt
// lookup. Unlike OP / Arbitrum, no RLP derivation is needed —
// the L2 hash is emitted directly in the event.
//
// The full `L2CanonicalTransaction` tuple is also returned so
// downstream callers can read protocol fields (e.g. the L2
// `value` for amount cross-checks). It is NOT used to derive
// the L1 deposit-fact triple `(depositSender, l1Token, amount)`
// for `fetch_failed_deposit_proof` — the canonical tx's `data`
// is an `L2AssetRouter.finalizeDeposit(uint256, bytes32 assetId,
// bytes transferData)` call whose `assetId` is a hashed
// identifier, not an address, so `l1Token` cannot be recovered
// from it without a runtime NTV lookup. The failed-deposit
// recovery verb instead takes the deposit facts as explicit
// parameters from the dapp (Option A, shape-twin of
// `fetch_message_proof`).
//
// Address filter: the event is emitted by the per-L2 chain
// diamond's MailboxFacet, NOT the Bridgehub proxy. The
// chain-diamond address is per-L2 and is not stored in the
// deploy registry; it is recoverable at runtime via
// `Bridgehub.getZKChain(chainId)` but that's an extra RPC.
// The scan therefore matches by `topic0` only — the receipt's
// log list is the source of truth, and a `NewPriorityRequest`
// log in an L1 receipt is unambiguous (the topic is unique to
// the event signature). Do not add an address filter "for
// safety": it would require a per-L2 runtime RPC and rule out
// receipts the verb should accept.
//
// Spec — https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/state-transition/chain-deps/facets/Mailbox.sol
// L2CanonicalTransaction struct — https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/Messaging.sol

import {
  array as array_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  decode_event_log,
  event_topic_hash,
  fixed_array as fixed_array_codec,
  tuple as tuple_codec,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  BytesSchema,
  type Hash32,
  Hash32Schema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import type { InferOutput } from "valibot"
import { array, object, parse } from "valibot"

export const L2CanonicalTransactionSchema = object({
  txType: Uint256Schema,
  from: Uint256Schema,
  to: Uint256Schema,
  gasLimit: Uint256Schema,
  gasPerPubdataByteLimit: Uint256Schema,
  maxFeePerGas: Uint256Schema,
  maxPriorityFeePerGas: Uint256Schema,
  paymaster: Uint256Schema,
  nonce: Uint256Schema,
  value: Uint256Schema,
  reserved: array(Uint256Schema),
  data: BytesSchema,
  signature: BytesSchema,
  factoryDeps: array(Uint256Schema),
  paymasterInput: BytesSchema,
  reservedDynamic: BytesSchema,
})
export type L2CanonicalTransaction = InferOutput<
  typeof L2CanonicalTransactionSchema
>

export const NewPriorityRequestLogSchema = object({
  tx_id: Uint256Schema,
  tx_hash: Hash32Schema,
  expiration_timestamp: Uint64Schema,
  transaction: L2CanonicalTransactionSchema,
  factory_deps: array(BytesSchema),
})
export type NewPriorityRequestLog = InferOutput<
  typeof NewPriorityRequestLogSchema
>

const L2_CANONICAL_TUPLE_CODEC = tuple_codec({
  txType: uint256_codec(),
  from: uint256_codec(),
  to: uint256_codec(),
  gasLimit: uint256_codec(),
  gasPerPubdataByteLimit: uint256_codec(),
  maxFeePerGas: uint256_codec(),
  maxPriorityFeePerGas: uint256_codec(),
  paymaster: uint256_codec(),
  nonce: uint256_codec(),
  value: uint256_codec(),
  reserved: fixed_array_codec(uint256_codec(), 4),
  data: bytes_codec(),
  signature: bytes_codec(),
  factoryDeps: array_codec(uint256_codec()),
  paymasterInput: bytes_codec(),
  reservedDynamic: bytes_codec(),
})

export const NEW_PRIORITY_REQUEST_CODECS = [
  uint256_codec(),
  bytes32_codec(),
  uint64_codec(),
  L2_CANONICAL_TUPLE_CODEC,
  array_codec(bytes_codec()),
] as const

const NEW_PRIORITY_REQUEST_INDEXED = [
  false,
  false,
  false,
  false,
  false,
]

export function decode_new_priority_request_log(
  log: Log,
): NewPriorityRequestLog | null {
  const topic0 = event_topic_hash(
    "NewPriorityRequest",
    NEW_PRIORITY_REQUEST_CODECS,
  )
  if (log.topics[0] !== topic0) return null
  const decoded = decode_event_log({
    name: "NewPriorityRequest",
    args: NEW_PRIORITY_REQUEST_CODECS,
    indexed: NEW_PRIORITY_REQUEST_INDEXED,
    topics: log.topics,
    data: log.data,
  })
  const [
    tx_id,
    tx_hash,
    expiration,
    transaction,
    factory_deps,
  ] = decoded.args
  return parse(NewPriorityRequestLogSchema, {
    tx_id,
    tx_hash,
    expiration_timestamp: expiration,
    transaction,
    factory_deps,
  })
}

export function decode_new_priority_request_from_receipt(input: {
  logs: readonly Log[]
}): NewPriorityRequestLog | null {
  for (const log of input.logs) {
    const decoded = decode_new_priority_request_log(log)
    if (decoded !== null) return decoded
  }
  return null
}

export function l2_hash_of_priority_request(
  log: NewPriorityRequestLog,
): Hash32 {
  return log.tx_hash
}
