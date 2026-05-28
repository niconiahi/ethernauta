import { BytesSchema } from "@ethernauta/core"
import { parse } from "valibot"

import { CallSchema } from "./call"
import type { Callable } from "./contract"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

export function create_read(
  chains: ChainEntry[],
): <T>(_call: Callable<T>) => Promise<T> {
  return async <T>(_call: Callable<T>): Promise<T> => {
    const transports = require_chain(chains, _call.chain_id)
    const call = parse(CallSchema, [
      "eth_call",
      [{ to: _call.to, input: _call.data }, "latest"],
    ])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return _call.decode(result)
  }
}
