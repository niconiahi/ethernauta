import type { Input } from "valibot"
import { array, object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { NotFound } from "../../../base"
import { notFoundSchema } from "../../../base"
import { blockNumberOrTagOrHashSchema } from "../../../block"
import type { ReceiptInfo } from "../../../receipt"
import { receiptInfoSchema } from "../../../receipt"

const parametersSchema = union([
  tuple([blockNumberOrTagOrHashSchema]),
  object({ blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema }),
])
type Parameters = Input<typeof parametersSchema>
export function getBlockReceipts(_parameters: Parameters): Readable<ReceiptInfo[] | NotFound> {
  return async (reader: Reader): Promise<ReceiptInfo[] | NotFound> => {
    const method = "eth_getBlockReceipts"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([array(receiptInfoSchema), notFoundSchema]), response.result)
    return result
  }
}
