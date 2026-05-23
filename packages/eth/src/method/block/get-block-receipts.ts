import type { NotFound } from "@ethernauta/core"
import { notFoundSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { array, object, parse, tuple, union } from "valibot"
import { blockNumberOrTagOrHashSchema } from "../../core/block"
import type { ReceiptInfo } from "../../core/receipt"
import { receiptInfoSchema } from "../../core/receipt"

const parametersSchema = union([
  tuple([blockNumberOrTagOrHashSchema]),
  object({
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function eth_getBlockReceipts(
  _parameters: Parameters,
): Readable<ReceiptInfo[] | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<ReceiptInfo[] | NotFound> => {
    const method = "eth_getBlockReceipts"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([array(receiptInfoSchema), notFoundSchema]),
      response.result,
    )
    return result
  }
}
