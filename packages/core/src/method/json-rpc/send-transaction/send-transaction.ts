
import { Hexadecimal, Writer, addressSchema, hexadecimalSchema } from "@ethernauta/core";
import { Input, literal, object, optional, parse, tuple } from "valibot";


export async function sendTransaction(writer: Writer, parameters: [Parameters]): Promise<Hexadecimal> {
  const method = 'eth_sendTransaction'
  const call = parse(sendTransactionSchema, [method, parameters])
  const response = await writer(call)

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
