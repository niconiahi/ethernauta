import { BytesSchema } from "@ethernauta/core"
import { parse } from "valibot"

import { CallSchema } from "./call"
import type { Callable } from "./contract"
import {
  type ChainEntry,
  create_dispatcher,
  require_chain,
} from "./reader"

export function create_read(
  chains: ChainEntry[],
): <T>(_call: Callable<T>) => Promise<T> {
  return async <T>(_call: Callable<T>): Promise<T> => {
    const { transports, strategy } = require_chain(
      chains,
      _call.chain_id,
    )
    const dispatcher = create_dispatcher(
      transports,
      strategy,
    )
    const call = parse(CallSchema, [
      "eth_call",
      [{ to: _call.to, input: _call.data }, "latest"],
    ])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return _call.decode(result)
  }
}
