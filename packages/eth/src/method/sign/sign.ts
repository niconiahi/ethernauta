import type { Bytes65 } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes65Schema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema, BytesSchema]),
  object({
    address: AddressSchema,
    message: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
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
    const parameters = parse(ParametersSchema, _parameters)
    const result = await signer("eth_sign", parameters)
    return parse(Bytes65Schema, result)
  }
}
