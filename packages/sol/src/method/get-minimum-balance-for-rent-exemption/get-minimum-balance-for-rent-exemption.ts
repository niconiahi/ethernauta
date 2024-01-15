import type { Input } from "valibot"
import { number, object, optional, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { commitmentSchema } from "../../core"

const configurationSchema = object({
  commitment: optional(commitmentSchema),
  minContextSlot: optional(number()),
})
const parametersSchema = union([
  tuple([number(), configurationSchema]),
  tuple([number()]),
  object({ usize: number(), configuration: optional(configurationSchema) }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function getMinimumBalanceForRentExemption(_parameters: Parameters): Readable<number> {
  return async (transports: Http[]): Promise<number> => {
    const method = "getMinimumBalanceForRentExemption"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(number(), response.result)
  }
}
