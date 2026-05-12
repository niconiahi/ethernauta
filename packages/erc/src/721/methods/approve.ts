import type {
  Signable,
  Signer,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, union, tuple, object } from "valibot"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    to: addressSchema,
    tokenId: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function approve(
  _parameters: Parameters,
): Signable<string> {
  return (_signer: Signer): Promise<string> => {
    const parameters = parse(parametersSchema, _parameters)
    return _signer("approve", parameters)
  }
}
