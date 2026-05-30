import type { Uint } from "@ethernauta/core"
import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

/**
 * @returns The created block filter's identifier
 */
export function eth_newPendingTransactionFilter(): Readable<Uint> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_newPendingTransactionFilter"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(UintSchema, response.result)
    return result
  }
}
