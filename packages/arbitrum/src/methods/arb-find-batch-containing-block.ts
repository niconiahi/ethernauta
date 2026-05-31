// https://github.com/OffchainLabs/nitro/blob/master/arbnode/api.go#L62
// `arb_findBatchContainingBlock(blockNumber)` — the L1 batch index
// that includes this L2 block. Useful for cross-referencing L2
// blocks against `SequencerInbox` batch metadata on L1. Registered
// as `Public: true` alongside `arb_getL1Confirmations`.

import type { Uint, Uint64 } from "@ethernauta/core"
import { Uint64Schema, UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  number,
  object,
  parse,
  pipe,
  string,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ blockNumber: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

// Plain `uint64` upstream → JSON number on the wire. Accept both
// shapes; see arb_getL1Confirmations for the rationale.
const ResultSchema = union([pipe(string()), number()])

function normalize_uint64(_value: string | number): Uint64 {
  const big =
    typeof _value === "string" && _value.startsWith("0x")
      ? BigInt(_value)
      : BigInt(_value)
  return parse(Uint64Schema, `0x${big.toString(16)}`)
}

/**
 * @returns The L1 batch index containing the given L2 block. Throws
 * if the block hasn't been included in any batch yet (typically
 * because it's pending sequencer batch-posting).
 */
export function arb_findBatchContainingBlock(
  _parameters: Parameters,
): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "arb_findBatchContainingBlock"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [Uint] = Array.isArray(parameters)
      ? parameters
      : [parameters.blockNumber]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(ResultSchema, response.result)
    return normalize_uint64(result)
  }
}
