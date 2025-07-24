import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { addressSchema, uint256Schema } from "../../../../core/base"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    spender: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function approve(_parameters: Parameters): Readable<boolean> {
  return async (transports: Http[]): Promise<boolean> => {
    const method = "approve"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
