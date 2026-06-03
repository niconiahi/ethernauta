// Typed error taxonomy for the zkSync bridge.
//
// Canonical sources (these are what each variant is grounded
// in — if upstream renames a custom error or changes a
// lifecycle rule, the entry here must follow):
//
//   - Bridgehub deposit + L2 base-cost surface:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridgehub/L1BridgehubErrors.sol
//     (`InvalidChainId`, `MsgValueMismatch`, …).
//   - Post-v26 withdrawal + failed-deposit surface on
//     `L1Nullifier`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol
//     (`WithdrawalAlreadyFinalized`, `MerkleProofVerificationFailed`,
//     `claimFailedDeposit`).
//   - L1→L2 / L2→L1 messaging lifecycle prose:
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// `ZksyncBridgeErrorSchema` is a discriminated union over the
// failure modes a dapp meaningfully wants to recover from.
// Slice 4a shipped the nominal `ProofUnavailable` variant per
// `01-scope.md`'s locked spec with an empty selector table.
// Slice 4c adds `AlreadyExecuted` for the
// `L1Nullifier.WithdrawalAlreadyFinalized` selector — mirrors
// Arbitrum 3c's `Outbox.AlreadySpent` → `AlreadyExecuted`
// mapping for cross-rollup naming consistency.
//
// Other L1Nullifier custom errors (`Unauthorized`,
// `EmptyDeposit`, `MerkleProofVerificationFailed`,
// `MalformedMessage`, …) are intentionally not mapped — they
// are proof-malformation / validation-style failures the dapp
// can't recover from inline; they surface as plain RPC errors
// with the upstream message verbatim.
//
//   - `ProofUnavailable` — `L1Nullifier.finalizeDeposit`
//     reverts because the message proof the caller supplied
//     anchors to a batch whose covering state-diff has not
//     yet been verified on L1.
//   - `AlreadyExecuted` —
//     `L1Nullifier.finalizeDeposit` reverts because the L2→L1
//     unlock at `(chainId, l2BatchNumber, l2MessageIndex)` has
//     already been finalized. Replaying is a no-op the dapp
//     can ignore.
//
// Cross-rollup unification of `ProofUnavailable` is
// intentionally out of scope per `01-scope.md` — each rollup
// ships its own nominal variant in its own discriminated
// union, so a dapp consuming multiple rollups discriminates
// per rollup, not per shared variant.
//
// `ZksyncBridgeFailure` is a plain `Error` subclass carrying
// the parsed variant on `.data` (R4 narrow exception — Error
// subclasses with a typed `.data` field are documented).
// Verbs themselves never call the decoder — the `create_bridge`
// factory in this package wraps both reader sides with
// `with_zksync_errors`, so recognized custom-error selectors
// flowing back from `eth_sendRawTransaction` become typed
// throws at the transport layer.
//
// Slice 4a of phase 05 — see tmp/plans/05_bridge_package/.

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

export const ZksyncBridgeErrorSchema = variant("kind", [
  object({ kind: literal("ProofUnavailable") }),
  object({ kind: literal("AlreadyExecuted") }),
])
export type ZksyncBridgeError = InferOutput<
  typeof ZksyncBridgeErrorSchema
>

export class ZksyncBridgeFailure extends Error {
  readonly data: ZksyncBridgeError
  constructor(data: ZksyncBridgeError) {
    super(data.kind)
    this.name = "ZksyncBridgeFailure"
    this.data = data
  }
}

// Selector table. Slice 4c wires the
// `L1Nullifier.WithdrawalAlreadyFinalized` custom error
// surfaced by `execute_withdraw` retries. The signature below
// matches
// `matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol`.
// `ProofUnavailable` stays unmapped — the upstream revert is
// not a custom error but a require-string thrown by
// `L1Messenger.proveL2MessageInclusionShared` inside
// `finalizeDeposit`'s validation path; surfaces as a plain RPC
// error with the upstream message verbatim until the L1Nullifier
// migrates to a typed selector.
const WITHDRAWAL_ALREADY_FINALIZED_SELECTOR =
  function_selector("WithdrawalAlreadyFinalized", [])

function selector_to_kind(
  selector: string,
): ZksyncBridgeError["kind"] | null {
  if (selector === WITHDRAWAL_ALREADY_FINALIZED_SELECTOR)
    return "AlreadyExecuted"
  return null
}

export function decode_zksync_bridge_error(
  revert: Bytes,
): ZksyncBridgeError | null {
  if (revert.length < 10) return null
  const selector = revert.slice(0, 10)
  const kind = selector_to_kind(selector)
  if (kind === null) return null
  return parse(ZksyncBridgeErrorSchema, { kind })
}

// Accepts both the direct `0x...` and the nested
// `{ data: "0x..." }` revert-payload shapes JSON-RPC nodes
// surface. Returns `null` on every other shape so the caller
// can fall back to throwing the plain RPC message.
export function try_decode_zksync_bridge_failure(
  error: RpcError,
): ZksyncBridgeFailure | null {
  const direct = safeParse(BytesSchema, error.data)
  if (direct.success) {
    const decoded = decode_zksync_bridge_error(
      direct.output,
    )
    if (decoded === null) return null
    return new ZksyncBridgeFailure(decoded)
  }
  const nested = safeParse(
    object({ data: string() }),
    error.data,
  )
  if (!nested.success) return null
  const inner = safeParse(BytesSchema, nested.output.data)
  if (!inner.success) return null
  const decoded = decode_zksync_bridge_error(inner.output)
  if (decoded === null) return null
  return new ZksyncBridgeFailure(decoded)
}

// Transport-layer decorator: wraps any Reader so that an RPC
// error carrying a recognized zkSync-bridge custom-error
// selector becomes a thrown `ZksyncBridgeFailure`. Unrecognized
// errors pass through unchanged. The OP / Arbitrum siblings are
// `with_op_errors` and `with_arbitrum_errors`.
export function with_zksync_errors(reader: Reader): Reader {
  return async (call) => {
    const response = await reader(call)
    if ("error" in response) {
      const failure = try_decode_zksync_bridge_failure(
        response.error,
      )
      if (failure) throw failure
    }
    return response
  }
}
