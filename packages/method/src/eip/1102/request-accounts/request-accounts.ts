import { Input, array, literal, parse, tuple } from "valibot";
import { Reader } from "@ethernauta/transport";
import { Address, addressSchema } from "@ethernauta/core";

export async function requestAccounts(reader: Reader): Promise<Array<Address>> {
  const method = 'eth_requestAccounts'
  const call = parse(requestAccountsSchema, [method])
  const response = await reader(call)
  const result = parse(array(addressSchema), response.result)

  return result
}

const requestAccountsSchema = tuple([literal('eth_requestAccounts')])
export type SendTransaction = Input<typeof requestAccountsSchema>
