import { UintSchema } from "@ethernauta/core"
import { AccessListSchema } from "@ethernauta/eip/2930"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import { GenericTransactionSchema } from "../../core/transaction"

const ParametersSchema = union([
  tuple([GenericTransactionSchema]),
  tuple([
    GenericTransactionSchema,
    BlockNumberOrTagOrHashSchema,
  ]),
  object({ transaction: GenericTransactionSchema }),
  object({
    transaction: GenericTransactionSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
const AccessListResultSchema = object({
  accessList: AccessListSchema,
  error: string(),
  gasUsed: UintSchema,
})
type Response = InferOutput<typeof AccessListResultSchema>
export function eth_createAccessList(
  _parameters: Parameters,
): Readable<Response> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Response> => {
    const method = "eth_createAccessList"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      AccessListResultSchema,
      response.result,
    )
    return result
  }
}
