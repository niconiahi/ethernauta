// https://github.com/OffchainLabs/nitro/blob/master/execution/gethexec/api.go#L74
// `auctioneer_submitAuctionResolutionTransaction(tx)` — submits a
// signed auction-resolution L2 transaction to the Express Lane
// auctioneer. Registered execution-side on the `auctioneer`
// namespace via `ArbTimeboostAuctioneerAPI`. The Go signature
// takes a `*types.Transaction` (the structured signed-tx object),
// not a raw RLP blob — geth's RPC framework JSON-unmarshals the
// param via `types.Transaction.UnmarshalJSON` which accepts the
// standard structured form. Returns `error`; on success the RPC
// result is `null`.

import { GenericTransactionSchema } from "@ethernauta/eth"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import {
  type InferOutput,
  null_,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([GenericTransactionSchema]),
  object({ transaction: GenericTransactionSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

const ResultSchema = null_()

export function auctioneer_submitAuctionResolutionTransaction(
  _parameters: Parameters,
): Writable<null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method =
      "auctioneer_submitAuctionResolutionTransaction"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.transaction]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(ResultSchema, response.result)
  }
}
