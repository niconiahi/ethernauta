import { literal, parse, union } from "valibot"

import type { SyncingStatus } from "@ethernauta/core"
import { syncingStatusSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

export function syncing(): Readable<SyncingStatus> {
  return async (reader: Reader): Promise<SyncingStatus> => {
    const method = "eth_syncing"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([syncingStatusSchema, literal(false)]), response.result)
    return result
  }
}
