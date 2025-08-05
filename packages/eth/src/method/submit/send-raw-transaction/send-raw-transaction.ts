import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"

import type {
  Writable,
  Writer,
  Transaction,
} from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import {
  bytesSchema,
  hash32Schema,
} from "../../../core/base"
import type { Hash32 } from "../../../core/base"

const parametersSchema = union([
  tuple([string()]),
  object({ transaction: string() }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Transaction<Hash32>> {
  return async (
    writer: Writer,
  ): Promise<Transaction<Hash32>> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    console.log("writer[0]", writer[0])
    const response = await writer[0](call)
    console.log("response", response)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(hash32Schema, response.result)
    return result
  }
}
