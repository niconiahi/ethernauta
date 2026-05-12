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
import { addressSchema } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema, boolean()]),
  object({
    operator: addressSchema,
    approved: boolean(),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function setApprovalForAll(
  _parameters: Parameters,
): Signable<string> {
  return (_signer: Signer): Promise<string> => {
    const parameters = parse(parametersSchema, _parameters)
    return _signer("setApprovalForAll", parameters)
  }
}
