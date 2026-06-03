// L2→L1 message extraction for zkSync-family bridges.
//
// Given an L2 transaction receipt (the one returned by
// `start_withdraw_*` or any L2 → L1 user message), scan its
// logs for `L1Messenger.L1MessageSent`, decode the event, and
// return the canonical `(sender, hash, message)` triple.
//
// Three consumers:
//   - the withdraw demo (closes the paste-from-explorer idiom);
//   - any dapp that wants to sanity-check the message hash
//     before passing the bundle to `execute_withdraw`;
//   - a future `fetch_message_proof` refactor that internally
//     consumes this decoder (tracked as a follow-up).
//
// `fetch_failed_deposit_proof` (slice 3) does NOT consume this
// decoder under the Option A design — slice 3 only needs the
// L2→L1 log proof RPC, not the message payload.
//
// Spec — https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/contracts/L1Messenger.sol.

import {
  address as address_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  decode_event_log,
  event_topic_hash,
} from "@ethernauta/abi"
import {
  type Address,
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { L1_MESSENGER_ADDRESS } from "../system-contracts/l1-messenger/address"

export const L1MessageSentLogSchema = object({
  sender: AddressSchema,
  hash: Bytes32Schema,
  message: BytesSchema,
})
export type L1MessageSentLog = InferOutput<
  typeof L1MessageSentLogSchema
>

const L1_MESSAGE_SENT_CODECS = [
  address_codec(),
  bytes32_codec(),
  bytes_codec(),
] as const
const L1_MESSAGE_SENT_INDEXED = [true, true, false]

export function decode_l1_message_sent_log(
  log: Log,
): L1MessageSentLog | null {
  if (
    log.address.toLowerCase() !==
    L1_MESSENGER_ADDRESS.toLowerCase()
  ) {
    return null
  }
  const topic0 = event_topic_hash(
    "L1MessageSent",
    L1_MESSAGE_SENT_CODECS,
  )
  if (log.topics[0] !== topic0) return null
  const decoded = decode_event_log({
    name: "L1MessageSent",
    args: L1_MESSAGE_SENT_CODECS,
    indexed: L1_MESSAGE_SENT_INDEXED,
    topics: log.topics,
    data: log.data,
  })
  const [sender, hash, message] = decoded.args
  return parse(L1MessageSentLogSchema, {
    sender,
    hash,
    message,
  })
}

export function decode_l1_message_sent_from_receipt(input: {
  logs: readonly Log[]
  expected_sender?: Address
}): L1MessageSentLog | null {
  for (const log of input.logs) {
    const decoded = decode_l1_message_sent_log(log)
    if (decoded === null) continue
    if (
      input.expected_sender !== undefined &&
      decoded.sender.toLowerCase() !==
        input.expected_sender.toLowerCase()
    ) {
      continue
    }
    return decoded
  }
  return null
}
