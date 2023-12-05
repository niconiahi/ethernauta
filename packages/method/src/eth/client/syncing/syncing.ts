import type { SyncingStatus } from "@ethernauta/core"
import { syncingStatusSchema } from "@ethernauta/core"
import type { Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { literal, parse, union } from "valibot"

/**
 * Returns an object with data about the sync status or false
 * @returns The syncing status
 */
export async function syncing(writer: Writer): Promise<SyncingStatus> {
  const method = "eth_syncing"
  const call = parse(callSchema, [method])
  const response = await writer(call)
  if ("error" in response) {
    throw new Error(response.error.message)
  }

  const result = parse(union([syncingStatusSchema, literal(false)]), response.result)

  return result
}
