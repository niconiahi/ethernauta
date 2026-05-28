import type { Bytes } from "@ethernauta/core"
import { BytesSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { GenericTransactionSchema } from "../../core/transaction"

const ParametersSchema = union([
  tuple([GenericTransactionSchema]),
  object({ transaction: GenericTransactionSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns RLP encoded transaction
 */
export function eth_signTransaction(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([
    signer,
    _sign_context,
  ]: ResolvedSigner): Promise<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const result = await signer(
      "eth_signTransaction",
      parameters,
    )
    return parse(BytesSchema, result)
  }
}
