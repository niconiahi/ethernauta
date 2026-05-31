// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_syncstatus

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import type { SyncStatus } from "../core/sync-status"
import { SyncStatusSchema } from "../core/sync-status"

/**
 * @returns The op-node sync status — head / safe / finalized
 * L1 and L2 block references — at the moment of the call.
 */
export function optimism_syncStatus(): Readable<SyncStatus> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<SyncStatus> => {
    const method = "optimism_syncStatus"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(SyncStatusSchema, response.result)
    return result
  }
}
