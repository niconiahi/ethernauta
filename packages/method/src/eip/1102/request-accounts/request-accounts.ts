import { array, parse } from "valibot"
import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"

export function requestAccounts(): Writable<Array<Address>> {
  return async (writer: Writer): Promise<Array<Address>> => {
    const method = "eth_requestAccounts"
    const call = parse(callSchema, [method])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(array(addressSchema), response.result)
    return result
  }
}
