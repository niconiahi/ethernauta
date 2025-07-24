import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { bytesSchema } from "../../../core/base"
import type { Bytes } from "../../../core/base"
import { blockNumberOrTagOrHashSchema } from "../../../core/block"
import { genericTransactionSchema } from "../../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagOrHashSchema]),
  object({ transaction: genericTransactionSchema }),
  object({ transaction: genericTransactionSchema, blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function eth_call(_parameters: Parameters): Writable<Bytes> {
  return async (writer: Writer): Promise<Bytes> => {
    const method = "eth_call"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(bytesSchema, response.result)
    return result
  }
}
