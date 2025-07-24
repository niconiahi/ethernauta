import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { uintSchema } from "../../../core/base"

const parametersSchema = union([
  tuple([uintSchema]),
  object({ filterIdentifier: uintSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns A boolean representing the success or failure of the uninstall
 */
export function eth_uninstallFilter(_parameters: Parameters): Readable<boolean> {
  return async (transports: Http[]): Promise<boolean> => {
    const method = "eth_uninstallFilter"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
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
