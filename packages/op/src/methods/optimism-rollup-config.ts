// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_rollupconfig

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import type { RollupConfig } from "../core/rollup-config"
import { RollupConfigSchema } from "../core/rollup-config"

/**
 * @returns The rollup configuration of the queried OP Stack
 * chain — genesis, hardfork activation times, L1 contract
 * addresses, batch inbox, system config.
 */
export function optimism_rollupConfig(): Readable<RollupConfig> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<RollupConfig> => {
    const method = "optimism_rollupConfig"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      RollupConfigSchema,
      response.result,
    )
    return result
  }
}
