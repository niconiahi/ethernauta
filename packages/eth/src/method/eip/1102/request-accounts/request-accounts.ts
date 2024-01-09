import { array, parse } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Address } from "../../../../core/base"
import { addressSchema } from "../../../../core/base"

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
