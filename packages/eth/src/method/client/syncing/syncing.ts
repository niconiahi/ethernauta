import { literal, parse, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { syncingStatusSchema } from "../../../core/client"
import type { SyncingStatus } from "../../../core/client"

export function eth_syncing(): Readable<SyncingStatus> {
  return async (transports: Http[]): Promise<SyncingStatus> => {
    const method = "eth_syncing"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([syncingStatusSchema, literal(false)]), response.result)
    return result
  }
}
