import { Hexadecimal, addressSchema, hexadecimalSchema, Reader } from "@ethernauta/core";
import { Input, literal, object, optional, parse, tuple } from "valibot";

// this is what Metamask implements
// https://eips.ethereum.org/EIPS/eip-1102
export async function requestAccounts(reader: Reader): Promise<Hexadecimal> {
  const method = 'eth_requestAccounts'
  const call = parse(requestAccountsSchema, [method])
  const response = await reader(call)

  return parse(hexadecimalSchema, response.result)
}

const requestAccountsSchema = tuple([literal('eth_requestAccounts')])
export type SendTransaction = Input<typeof requestAccountsSchema>
