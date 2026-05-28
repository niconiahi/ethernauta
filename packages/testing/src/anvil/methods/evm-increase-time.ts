// https://getfoundry.sh/anvil/custom-methods#time-manipulation
//
// Anvil signature: `evm_increase_time(seconds: U256) ->
// Result<i64>` (see `crates/anvil/src/eth/api.rs`). Jumps the
// block-timestamp clock forward by the requested number of
// seconds and returns the new timestamp as a signed 64-bit
// integer — serialised as a plain JSON number, not a hex
// string. We accept either a `number` or `bigint` from the wire
// and normalise to `bigint` because i64 values can overflow
// JS's safe-integer range under contrived test setups.

import { UintSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  bigint,
  number,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ seconds: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

const ResultSchema = union([number(), bigint()])

export function evm_increaseTime(
  _parameters: Parameters,
): Writable<bigint> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<bigint> => {
    const method = "evm_increaseTime"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(ResultSchema, response.result)
    return BigInt(result)
  }
}
