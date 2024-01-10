import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import type { Uint } from "../../../core/base"
import { blockNumberOrTagSchema } from "../../../core/block"
import { genericTransactionSchema } from "../../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagSchema]),
  object({ transaction: genericTransactionSchema }),
  object({ transaction: genericTransactionSchema, blockNumberOrTag: blockNumberOrTagSchema }),
])
type Parameters = Input<typeof parametersSchema>
export function eth_estimateGas(_parameters: Parameters): Writable<Uint> {
  return async (writer: Writer): Promise<Uint> => {
    const method = "eth_estimateGas"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
