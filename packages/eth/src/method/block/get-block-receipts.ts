import type { NotFound } from "@ethernauta/core"
import { NotFoundSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { array, object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import type { ReceiptInfo } from "../../core/receipt"
import { ReceiptInfoSchema } from "../../core/receipt"

const ParametersSchema = union([
  tuple([BlockNumberOrTagOrHashSchema]),
  object({
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_getBlockReceipts(
  _parameters: Parameters,
): Readable<ReceiptInfo[] | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<ReceiptInfo[] | NotFound> => {
    const method = "eth_getBlockReceipts"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([array(ReceiptInfoSchema), NotFoundSchema]),
      response.result,
    )
    return result
  }
}
