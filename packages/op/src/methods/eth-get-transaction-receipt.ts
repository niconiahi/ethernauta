// OP-aware `eth_getTransactionReceipt`. Mirrors the base
// `@ethernauta/eth` method but parses the response through
// `OpReceiptInfoSchema` so deposit-tx receipts surface
// `depositNonce` and `depositReceiptVersion` (post-Canyon).

import type { NotFound } from "@ethernauta/core"
import {
  Hash32Schema,
  NotFoundSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { OpReceiptInfo } from "../core/op-receipt"
import { OpReceiptInfoSchema } from "../core/op-receipt"

const ParametersSchema = union([
  tuple([Hash32Schema]),
  object({ transactionHash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function eth_getTransactionReceipt(
  _parameters: Parameters,
): Readable<OpReceiptInfo | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<OpReceiptInfo | NotFound> => {
    const method = "eth_getTransactionReceipt"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      union([OpReceiptInfoSchema, NotFoundSchema]),
      response.result,
    )
  }
}
