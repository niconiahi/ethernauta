import type { InferOutput } from "valibot"
import {
  object,
  parse,
  // string,
  tuple,
  union,
} from "valibot"

import type {
  Writable,
  Transaction,
  Http,
} from "@cryptoman/transport"
import {
  callSchema,
  // store_transaction,
} from "@cryptoman/transport"

import { Hash32Schema } from "../../core/base"
import type { Hash32 } from "../../core/base"

const parametersSchema = union([
  tuple([Hash32Schema]),
  object({ transaction: Hash32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Transaction<Hash32>> {
  return async (
    transports: Http[],
  ): Promise<Transaction<Hash32>> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    console.log("response", response)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(Hash32Schema, response.result)
    return result
  }
}
