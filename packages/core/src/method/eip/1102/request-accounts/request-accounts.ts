import { Hexadecimal, hexadecimalSchema, Reader } from "@ethernauta/core";
import { Input, literal, parse, tuple } from "valibot";

export async function requestAccounts(reader: Reader): Promise<Hexadecimal> {
  const method = 'eth_requestAccounts'
  const call = parse(requestAccountsSchema, [method])
  const response = await reader(call)

  return parse(hexadecimalSchema, response.result)
}

const requestAccountsSchema = tuple([literal('eth_requestAccounts')])
export type SendTransaction = Input<typeof requestAccountsSchema>
