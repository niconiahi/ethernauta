import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Bytes } from "@ethernauta/core"
import { bytesSchema } from "@ethernauta/core"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
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
    const parameters = parse(parametersSchema, _parameters)
    const result = await signer(
      "eth_signTransaction",
      parameters,
    )
    return parse(bytesSchema, result)
  }
}
