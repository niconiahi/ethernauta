import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ filterIdentifier: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns A boolean representing the success or failure of the uninstall
 */
export function eth_uninstallFilter(
  _parameters: Parameters,
): Readable<boolean> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<boolean> => {
    const method = "eth_uninstallFilter"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
