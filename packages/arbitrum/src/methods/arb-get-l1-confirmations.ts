// https://github.com/OffchainLabs/nitro/blob/master/arbnode/api.go#L52
// `arb_getL1Confirmations(blockNumber)` — how many L1 confirmations
// the batch containing this L2 block has accumulated. Registered as
// `Public: true` on the consensus-side `arb` namespace in
// `arbnode/node.go`, exposed by operators that whitelist `arb` in
// their RPC namespace allowlist.

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

// Upstream signature is plain `uint64` (no `hexutil.Uint64`), so
// geth's rpc framework emits the result as a JSON number. Accept
// both shapes to be robust against operator-side encoding shims
// (some RPC providers wrap with `hexutil.Uint64` themselves).
const ResultSchema = union([pipe(string()), number()])

function normalize_uint64(_value: string | number): Uint64 {
  const big =
    typeof _value === "string" && _value.startsWith("0x")
      ? BigInt(_value)
      : BigInt(_value)
  return parse(Uint64Schema, `0x${big.toString(16)}`)
}

/**
 * @returns The number of L1 confirmations for the batch containing
 * the given L2 block. `0` means the batch hasn't been posted to L1
 * yet (or hasn't been seen as posted by the answering node).
 */
export function arb_getL1Confirmations(
  _parameters: Parameters,
): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "arb_getL1Confirmations"
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
