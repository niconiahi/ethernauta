import type { Hash32 } from "@ethernauta/core"
import { hash32Schema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendTransaction(
  _parameters: Parameters,
): Signable<Hash32> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Hash32> => {
    const parameters = parse(parametersSchema, _parameters)
    const result = await signer(
      "eth_sendTransaction",
      parameters,
    )
    return parse(hash32Schema, result)
  }
}
