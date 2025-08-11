import type {
  Address,
  Http,
  Writable,
} from "@ethernauta/transport"
import {
  addressSchema,
  callSchema,
} from "@ethernauta/transport"
import { array, parse } from "valibot"

export function requestAccounts(): Writable<
  Array<Address>
> {
  return async (
    transports: Http[],
  ): Promise<Array<Address>> => {
    const method = "eth_requestAccounts"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      array(addressSchema),
      response.result,
    )
    return result
  }
}
