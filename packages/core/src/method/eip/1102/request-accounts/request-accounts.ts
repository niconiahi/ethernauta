import { Base16, base16Schema, Reader } from "@ethernauta/core";
import { Input, literal, parse, tuple } from "valibot";

export async function requestAccounts(reader: Reader): Promise<Base16> {
  const method = 'eth_requestAccounts'
  const call = parse(requestAccountsSchema, [method])
  const response = await reader(call)

  return parse(base16Schema, response.result)
}

const requestAccountsSchema = tuple([literal('eth_requestAccounts')])
export type SendTransaction = Input<typeof requestAccountsSchema>
