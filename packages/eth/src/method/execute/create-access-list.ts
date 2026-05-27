import { uintSchema } from "@ethernauta/core"
import { accessListSchema } from "@ethernauta/eip/2930"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"
import { blockNumberOrTagOrHashSchema } from "../../core/block"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([
    genericTransactionSchema,
    blockNumberOrTagOrHashSchema,
  ]),
  object({ transaction: genericTransactionSchema }),
  object({
    transaction: genericTransactionSchema,
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
const accessListResultSchema = object({
  accessList: accessListSchema,
  error: string(),
  gasUsed: uintSchema,
})
type Response = InferOutput<typeof accessListResultSchema>
export function eth_createAccessList(
  _parameters: Parameters,
): Readable<Response> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Response> => {
    const method = "eth_createAccessList"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      accessListResultSchema,
      response.result,
    )
    return result
  }
}
