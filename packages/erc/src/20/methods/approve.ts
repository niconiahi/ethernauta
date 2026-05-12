import type {
  Signable,
  Signer,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  parse,
  tuple,
  object,
  union,
  boolean,
} from "valibot"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"

export const OutputSchema = union([boolean()])
export type Output = InferOutput<typeof OutputSchema>

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    spender: addressSchema,
    value: uint256Schema,
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
