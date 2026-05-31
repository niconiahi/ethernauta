// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_version

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse, string } from "valibot"

/**
 * @returns The version string of the answering op-node
 * (e.g. `"v1.10.2"`).
 */
export function optimism_version(): Readable<string> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<string> => {
    const method = "optimism_version"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(string(), response.result)
    return result
  }
}
