import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { literal, parse, union } from "valibot"
import type { SyncingStatus } from "../../core/client"
import { SyncingStatusSchema } from "../../core/client"

export function eth_syncing(): Readable<SyncingStatus> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<SyncingStatus> => {
    const method = "eth_syncing"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([SyncingStatusSchema, literal(false)]),
      response.result,
    )
    return result
  }
}
