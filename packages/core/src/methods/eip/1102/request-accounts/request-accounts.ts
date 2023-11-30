import { Hexadecimal, addressSchema, hexadecimalSchema, Reader } from "@ethernauta/core";
import { Input, literal, object, optional, parse, tuple } from "valibot";

// this is what Metamask implements
// https://eips.ethereum.org/EIPS/eip-1102
export async function requestAccounts(reader: Reader): Promise<Hexadecimal> {
  const method = 'eth_requestAccounts'
  const call = parse(sendTransactionSchema, [method])
  const response = await reader(call)

  return parse(hexadecimalSchema, response.result)
}

const parametersSchema = object({
  from: addressSchema,
  to: optional(addressSchema),
  gas: optional(hexadecimalSchema),
  gasPrice: optional(hexadecimalSchema),
  value: optional(hexadecimalSchema),
  data: hexadecimalSchema,
  nonce: optional(hexadecimalSchema)
})
type Parameters = Input<typeof parametersSchema>
const sendTransactionSchema = tuple([
  literal('eth_sendTransaction'),
  tuple([parametersSchema])
])
export type SendTransaction = Input<typeof sendTransactionSchema>
