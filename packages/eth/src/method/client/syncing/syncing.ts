import { literal, parse, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { syncingStatusSchema } from "../../../core/client"
import type { SyncingStatus } from "../../../core/client"

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
