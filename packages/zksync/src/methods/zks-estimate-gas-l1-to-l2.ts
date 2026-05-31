// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-estimategasl1tol2
// Gas estimate for an L1→L2 message — the L2-side gas the bridge
// has to forward when funding the canonical retryable. Same input
// shape as `eth_call` (a `GenericTransaction` + optional state
// override), single U256 out.

import type { Uint256 } from "@ethernauta/core"
import { Uint256Schema } from "@ethernauta/core"
import type { StateOverride } from "@ethernauta/eth"
import {
  GenericTransactionSchema,
  StateOverrideSchema,
} from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse } from "valibot"

type Tx = InferOutput<typeof GenericTransactionSchema>

export function zks_estimateGasL1ToL2(
  _tx: Tx,
  _state_override?: StateOverride,
): Readable<Uint256> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint256> => {
    const method = "zks_estimateGasL1ToL2"
    const tx = parse(GenericTransactionSchema, _tx)
    const state_override =
      _state_override === undefined
        ? undefined
        : parse(StateOverrideSchema, _state_override)
    const positional =
      state_override === undefined
        ? [tx]
        : [tx, state_override]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(Uint256Schema, response.result)
  }
}
