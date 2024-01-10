import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

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
type Parameters = Input<typeof parametersSchema>
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
