
import { Base16, Writer, addressSchema, base16Schema } from "@ethernauta/core";
import { Input, literal, object, optional, parse, tuple } from "valibot";


export async function sendTransaction(writer: Writer, parameters: [Parameters]): Promise<Base16> {
  const method = 'eth_sendTransaction'
  const call = parse(sendTransactionSchema, [method, parameters])
  const response = await writer(call)

  return parse(base16Schema, response.result)
}

const parametersSchema = object({
  from: addressSchema,
  to: optional(addressSchema),
  gas: optional(base16Schema),
  gasPrice: optional(base16Schema),
  value: optional(base16Schema),
  data: base16Schema,
  nonce: optional(base16Schema)
})
type Parameters = Input<typeof parametersSchema>
const sendTransactionSchema = tuple([
  literal('eth_sendTransaction'),
  tuple([parametersSchema])
])
export type SendTransaction = Input<typeof sendTransactionSchema>
