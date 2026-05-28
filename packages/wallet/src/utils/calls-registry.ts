// https://eips.ethereum.org/EIPS/eip-5792
//
// Persistent batch registry: maps a wallet-issued batch id to
// the set of transaction hashes the wallet broadcast for it. Lives in
// chrome.storage.session so the background script can answer
// wallet_getCallsStatus polls without re-opening the popup.

import { Hash32Schema, UintSchema } from "@ethernauta/core"
import {
  array,
  boolean,
  type InferOutput,
  object,
  parse,
  string,
} from "valibot"

const KEY_PREFIX = "calls_"

export const BatchRecordSchema = object({
  id: string(),
  chainId: UintSchema,
  atomic: boolean(),
  transaction_hashes: array(Hash32Schema),
})
export type BatchRecord = InferOutput<
  typeof BatchRecordSchema
>

function compose_key(id: string): string {
  return `${KEY_PREFIX}${id}`
}

export function generate_batch_id(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let hex = "0x"
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0")
  }
  return hex
}

export async function set_batch(
  record: BatchRecord,
): Promise<void> {
  await chrome.storage.session.set({
    [compose_key(record.id)]: record,
  })
}

export async function get_batch(
  id: string,
): Promise<BatchRecord | undefined> {
  const key = compose_key(id)
  const result = await chrome.storage.session.get(key)
  const raw = result[key]
  if (raw === undefined) return undefined
  const batch_record = parse(BatchRecordSchema, raw)
  return batch_record
}
