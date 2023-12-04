import { array, parse } from "valibot";
import { Reader, callSchema } from "@ethernauta/transport";
import { Address, addressSchema } from "@ethernauta/core";

export async function requestAccounts(reader: Reader): Promise<Array<Address>> {
  const method = 'eth_requestAccounts'
  const call = parse(callSchema, [method])
  const response = await reader(call)
  if ('error' in response) {
    throw new Error(response.error.message)
  }
  const result = parse(array(addressSchema), response.result)

  return result
}

