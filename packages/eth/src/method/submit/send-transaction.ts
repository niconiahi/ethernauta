import type { Hash32 } from "@ethernauta/core"
import { Hash32Schema } from "@ethernauta/core"
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
 * @returns The transaction hash
 */
export function eth_sendTransaction(
  _parameters: Parameters,
): Signable<Hash32> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Hash32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const result = await signer(
      "eth_sendTransaction",
      parameters,
    )
    return parse(Hash32Schema, result)
  }
}
