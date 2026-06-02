// Typed error taxonomy for the OP-stack bridge.
//
// `OpBridgeErrorSchema` is a discriminated union over the four
// states the dapp meaningfully wants to recover from when
// `prove_withdraw` or `execute_withdraw` reverts on L1 under
// fault proofs:
//
//   - `ProofUnavailable` — the proof has nothing to anchor to
//     yet (no dispute game covers the withdrawal's L2 block,
//     or the proof was submitted before the respected game
//     type was last updated and the portal rejects it as
//     out-of-window).
//   - `GameUnresolved` — the dispute game backing the proof
//     is still `IN_PROGRESS`. The dapp polls; eventually the
//     game resolves and `execute_withdraw` becomes callable.
//   - `GameInvalidated` — the dispute game resolved against
//     the proposer, was blacklisted by `AnchorStateRegistry`,
//     or the respected game type changed under the proof. The
//     proof is dead; the dapp must call `prove_withdraw` again
//     against a fresh game.
//   - `ProofNotMature` — proof recorded on L1 but the
//     `proofMaturityDelaySeconds` window has not elapsed. The
//     dapp polls; eventually the window passes and
//     `execute_withdraw` becomes callable.
//
// `OpBridgeFailure` is a plain `Error` subclass carrying the
// parsed variant on `.data`. Verbs throw an `OpBridgeFailure`
// when the RPC error from `eth_sendRawTransaction` carries a
// known custom-error selector in its `data` field.
//
// `try_decode_op_bridge_failure` is the decoder: given a
// JSON-RPC `RpcError`, it pulls the revert payload from `data`,
// reads the 4-byte selector, and returns an `OpBridgeFailure`
// if the selector matches a known op-contracts custom error.
// Returns `null` on every other error so the verb can fall
// back to throwing a plain `Error(error.message)`.
//
// Selectors are derived at runtime from the canonical custom
// error names declared on `OptimismPortal2` — they shift if
// op-contracts ever renames an error, but that's a deliberate
// upstream break that should be re-pinned alongside the ABI.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import { function_selector } from "@ethernauta/abi"
import { type Bytes, BytesSchema } from "@ethernauta/core"
import type {
  Reader,
  RpcError,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  literal,
  object,
  parse,
  safeParse,
  string,
  variant,
} from "valibot"

export const OpBridgeErrorSchema = variant("kind", [
  object({ kind: literal("ProofUnavailable") }),
  object({ kind: literal("GameUnresolved") }),
  object({ kind: literal("GameInvalidated") }),
  object({ kind: literal("ProofNotMature") }),
])
export type OpBridgeError = InferOutput<
  typeof OpBridgeErrorSchema
>

export class OpBridgeFailure extends Error {
  readonly data: OpBridgeError
  constructor(data: OpBridgeError) {
    super(data.kind)
    this.name = "OpBridgeFailure"
    this.data = data
  }
}

// Canonical custom-error selectors from
// `packages/op/src/bridge/optimism-portal/OptimismPortal2.abi.json`
// (search for `"type": "error"`). Each selector decodes to one
// of the four `OpBridgeError.kind` values; multiple selectors
// can collapse to the same kind (e.g. `InvalidDisputeGame` +
// `ImproperDisputeGame` both mean the proof's game is dead).
const PROOF_NOT_OLD_ENOUGH_SELECTOR = function_selector(
  "OptimismPortal_ProofNotOldEnough",
  [],
)
const INVALID_DISPUTE_GAME_SELECTOR = function_selector(
  "OptimismPortal_InvalidDisputeGame",
  [],
)
const IMPROPER_DISPUTE_GAME_SELECTOR = function_selector(
  "OptimismPortal_ImproperDisputeGame",
  [],
)
const INVALID_PROOF_TIMESTAMP_SELECTOR = function_selector(
  "OptimismPortal_InvalidProofTimestamp",
  [],
)
const INVALID_ROOT_CLAIM_SELECTOR = function_selector(
  "OptimismPortal_InvalidRootClaim",
  [],
)

function selector_to_kind(
  selector: string,
): OpBridgeError["kind"] | null {
  if (selector === PROOF_NOT_OLD_ENOUGH_SELECTOR)
    return "ProofNotMature"
  if (selector === INVALID_DISPUTE_GAME_SELECTOR)
    return "GameInvalidated"
  if (selector === IMPROPER_DISPUTE_GAME_SELECTOR)
    return "GameInvalidated"
  if (selector === INVALID_PROOF_TIMESTAMP_SELECTOR)
    return "ProofUnavailable"
  if (selector === INVALID_ROOT_CLAIM_SELECTOR)
    return "GameUnresolved"
  return null
}

export function decode_op_bridge_error(
  revert: Bytes,
): OpBridgeError | null {
  if (revert.length < 10) return null
  const selector = revert.slice(0, 10)
  const kind = selector_to_kind(selector)
  if (kind === null) return null
  return parse(OpBridgeErrorSchema, { kind })
}

// JSON-RPC nodes surface the revert payload in different
// shapes — some put a Bytes hex directly under `error.data`,
// others wrap it in `{ data: "0x..." }` or
// `{ originalError: { data: "0x..." } }`. The decoder accepts
// the most common shape (string or `{ data: string }`) and
// silently bails on anything else, leaving the caller to
// throw the plain RPC message.
export function try_decode_op_bridge_failure(
  error: RpcError,
): OpBridgeFailure | null {
  const direct = safeParse(BytesSchema, error.data)
  if (direct.success) {
    const decoded = decode_op_bridge_error(direct.output)
    if (decoded === null) return null
    return new OpBridgeFailure(decoded)
  }
  const nested = safeParse(
    object({ data: string() }),
    error.data,
  )
  if (!nested.success) return null
  const inner = safeParse(BytesSchema, nested.output.data)
  if (!inner.success) return null
  const decoded = decode_op_bridge_error(inner.output)
  if (decoded === null) return null
  return new OpBridgeFailure(decoded)
}

// Transport-layer decorator: wraps any Reader so that an
// RPC error carrying a recognized OP-portal custom-error
// selector becomes a thrown `OpBridgeFailure`. Unrecognized
// errors pass through unchanged — downstream methods still
// see them as plain `error` responses and decide how to
// throw. Compose at the call site: e.g.
//
//   const reader = with_op_errors(resolved.l1.reader)
//   await eth_sendRawTransaction([signed])(
//     [reader, { chain_id }],
//   )
//
// Sibling pattern shipped by other rollup packages:
// `with_arbitrum_errors`, `with_zksync_errors`, etc.
export function with_op_errors(reader: Reader): Reader {
  return async (call) => {
    const response = await reader(call)
    if ("error" in response) {
      const failure = try_decode_op_bridge_failure(
        response.error,
      )
      if (failure) throw failure
    }
    return response
  }
}
