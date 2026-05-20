// https://eips.ethereum.org/EIPS/eip-5792
//
// Persistent batch registry: maps a wallet-issued batch id to
// the set of tx hashes the wallet broadcast for it. Lives in
// chrome.storage.session so the background script can answer
// wallet_getCallsStatus polls without re-opening the popup.

const KEY_PREFIX = "calls_"

export type BatchRecord = {
  id: string
  chainId: `0x${string}`
  atomic: boolean
  tx_hashes: `0x${string}`[]
}

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
  return result[key] as BatchRecord | undefined
}
