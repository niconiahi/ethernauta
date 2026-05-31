// https://github.com/OffchainLabs/nitro/blob/master/execution/gethexec/api.go#L59
// `arb_getRawBlockMetadata(fromBlock, toBlock)` — returns the
// Timeboost auction metadata raw bytes per L2 block in the given
// range. Registered execution-side on the `arb` namespace alongside
// `ArbAPI`. Upstream marks the service `Public: false` (operator
// opt-in by RPC namespace allowlist); major providers expose it
// regardless because searcher/MEV workloads need it.

import type { BlockNumberOrTag } from "@ethernauta/eth"
import { BlockNumberOrTagSchema } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import {
  array,
  type InferOutput,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import {
  type NumberAndBlockMetadata,
  NumberAndBlockMetadataSchema,
} from "../core/number-and-block-metadata"

const ParametersSchema = union([
  tuple([BlockNumberOrTagSchema, BlockNumberOrTagSchema]),
  object({
    fromBlock: BlockNumberOrTagSchema,
    toBlock: BlockNumberOrTagSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

const ResultSchema = array(NumberAndBlockMetadataSchema)

export function arb_getRawBlockMetadata(
  _parameters: Parameters,
): Readable<NumberAndBlockMetadata[]> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<NumberAndBlockMetadata[]> => {
    const method = "arb_getRawBlockMetadata"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [BlockNumberOrTag, BlockNumberOrTag] =
      Array.isArray(parameters)
        ? parameters
        : [parameters.fromBlock, parameters.toBlock]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(ResultSchema, response.result)
  }
}
