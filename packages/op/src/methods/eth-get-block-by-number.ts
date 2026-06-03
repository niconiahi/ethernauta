// OP-aware `eth_getBlockByNumber`. Mirrors the base
// `@ethernauta/eth` method but parses the response through
// `OpBlockSchema` so deposit-tx entries inside
// `block.transactions` surface their extra fields
// (`sourceHash`, `mint`, `l1BlockNumber`, `l1Timestamp`,
// `depositNonce`, `depositReceiptVersion`).
//
// Dapps on OP-stack chains import this version; dapps on
// non-OP chains stay on `@ethernauta/eth`. The function name
// is identical so the package subpath is the discriminator.

import type { NotFound } from "@ethernauta/core"
import { NotFoundSchema } from "@ethernauta/core"
import { BlockNumberOrTagSchema } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

import type { OpBlock } from "../core/op-block"
import { OpBlockSchema } from "../core/op-block"

const ParametersSchema = union([
  tuple([BlockNumberOrTagSchema, boolean()]),
  object({
    blockNumberOrTag: BlockNumberOrTagSchema,
    hydratedTransactions: boolean(),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function eth_getBlockByNumber(
  _parameters: Parameters,
): Readable<OpBlock | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<OpBlock | NotFound> => {
    const method = "eth_getBlockByNumber"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      union([OpBlockSchema, NotFoundSchema]),
      response.result,
    )
  }
}
