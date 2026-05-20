import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Bytes65 } from "@ethernauta/core"
import {
  addressSchema,
  bytes65Schema,
  bytesSchema,
} from "@ethernauta/core"

const parametersSchema = union([
  tuple([addressSchema, bytesSchema]),
  object({
    address: addressSchema,
    message: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The EIP-191 signature over the provided data
 */
export function eth_sign(
  _parameters: Parameters,
): Signable<Bytes65> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes65> => {
    const parameters = parse(parametersSchema, _parameters)
    const result = await signer("eth_sign", parameters)
    return parse(bytes65Schema, result)
  }
}
