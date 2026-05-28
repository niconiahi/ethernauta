import {
  type AbiCodec,
  type DecodedEventLog,
  decode_event_log,
  encode_event_topics,
} from "@ethernauta/abi"
import { AddressSchema, UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  nullable,
  object,
  optional,
  parse,
  string,
  unknown,
} from "valibot"

import { LogSchema } from "../../core/receipt"
import { eth_getLogs } from "./get-logs"

// Boundary schema for the non-codec parts. `args` (the codec
// tuple) is the conventions-skill carve-out for generic
// transport shapes.
export const GetContractEventsInputSchema = object({
  address: AddressSchema,
  name: string(),
  indexed: array(boolean()),
  fromBlock: UintSchema,
  toBlock: UintSchema,
  values: optional(array(nullable(unknown()))),
  anonymous: optional(boolean()),
})
export type GetContractEventsInput = InferOutput<
  typeof GetContractEventsInputSchema
>

// Compose eth_getLogs + decode_event_log into a typed
// contract-event reader. The filter's topic list is built
// from `name` + `args` + `indexed` + `values` so callers
// never hand-craft topic0; per-position wildcards are
// supported via `null` in `values`.
export function get_contract_events<
  const Args extends readonly AbiCodec<unknown>[],
>(
  _parameters: GetContractEventsInput & {
    args: Args
  },
): Readable<DecodedEventLog[]> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<DecodedEventLog[]> => {
    const { args } = _parameters
    const parameters = parse(
      GetContractEventsInputSchema,
      _parameters,
    )
    const {
      address,
      name,
      indexed,
      fromBlock,
      toBlock,
      values,
      anonymous,
    } = parameters
    const topics = encode_event_topics({
      name,
      args,
      indexed,
      values,
      anonymous,
    })
    const results = await eth_getLogs([
      { address, fromBlock, toBlock, topics },
    ])([transports, _context])
    return results.map((entry) => {
      const log = parse(LogSchema, entry)
      return decode_event_log({
        name,
        args,
        indexed,
        topics: log.topics,
        data: log.data,
        anonymous,
      })
    })
  }
}
