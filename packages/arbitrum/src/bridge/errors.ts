// Typed error taxonomy for the Arbitrum bridge.
//
// Canonical sources (these are what each variant is grounded
// in — if upstream renames a custom error or changes a
// lifecycle rule, the entry here must follow):
//
//   - Outbox proof construction + redemption:
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/bridge/Outbox.sol
//     (`executeTransaction`, `executeTransactionSimulation`,
//     `roots`). The outbox stores send-roots only after the
//     covering RBlock assertion has been confirmed by the
//     Rollup contract.
//   - Retryable ticket lifecycle (L1→L2 deposits + delayed
//     execution):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbRetryableTx.sol
//     (`getLifetime`, `redeem`, `cancel`, `getTimeout`). The
//     default lifetime is 7 days from creation; after that
//     `redeem`/`getTimeout` revert because the ticket no
//     longer exists in retryable storage.
//   - Lifecycle prose written against:
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//     and
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging
//
// `ArbitrumBridgeErrorSchema` is a discriminated union over
// the failure modes a dapp meaningfully wants to recover from.
// Slice 3a declares the two variants the rollup's proof +
// retryable surfaces will exercise; the selector table is
// intentionally empty until slice 3b lands `redeem_retryable`
// / `cancel_retryable` and slice 3c lands `execute_withdraw` —
// those verbs surface the canonical custom-error selectors
// from `Outbox` / `ArbRetryableTx` and the table is populated
// at that point.
//
//   - `ProofUnavailable` — `Outbox.executeTransaction` reverts
//     because the send-root the caller's proof anchors to
//     hasn't been written to `Outbox.roots` yet (the covering
//     RBlock assertion is not yet confirmed by `Rollup`, or
//     the proof targets a root that was never accepted).
//   - `RetryableExpired` — `ArbRetryableTx.redeem` /
//     `getTimeout` reverts because the ticket aged past
//     `getLifetime()` (default 7 days; configurable per chain
//     via `retryableLifetimeSeconds` on the ArbitrumNetwork
//     entry) and was garbage-collected from retryable storage.
//
// `ArbitrumBridgeFailure` is a plain `Error` subclass carrying
// the parsed variant on `.data`. Verbs themselves never call
// the decoder — the `create_bridge` factory in this package
// wraps both reader sides with `with_arbitrum_errors`, so
// recognized custom-error selectors flowing back from
// `eth_sendRawTransaction` become typed throws at the
// transport layer.
//
// Slice 3a of phase 05 — see tmp/plans/05_bridge_package/.

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

export const ArbitrumBridgeErrorSchema = variant("kind", [
  object({ kind: literal("ProofUnavailable") }),
  object({ kind: literal("RetryableExpired") }),
])
export type ArbitrumBridgeError = InferOutput<
  typeof ArbitrumBridgeErrorSchema
>

export class ArbitrumBridgeFailure extends Error {
  readonly data: ArbitrumBridgeError
  constructor(data: ArbitrumBridgeError) {
    super(data.kind)
    this.name = "ArbitrumBridgeFailure"
    this.data = data
  }
}

// Selector table is intentionally empty in slice 3a. The
// canonical custom-error selectors from `Outbox`
// (`ProofTooLong`, `PathNotMinimal`, `UnknownRoot`, …) and
// `ArbRetryableTx` are wired in slice 3b/3c alongside the
// verbs that surface them.
function selector_to_kind(
  _selector: string,
): ArbitrumBridgeError["kind"] | null {
  return null
}

export function decode_arbitrum_bridge_error(
  revert: Bytes,
): ArbitrumBridgeError | null {
  if (revert.length < 10) return null
  const selector = revert.slice(0, 10)
  const kind = selector_to_kind(selector)
  if (kind === null) return null
  return parse(ArbitrumBridgeErrorSchema, { kind })
}

// Accepts both the direct `0x...` and the nested
// `{ data: "0x..." }` revert-payload shapes JSON-RPC nodes
// surface. Returns `null` on every other shape so the caller
// can fall back to throwing the plain RPC message.
export function try_decode_arbitrum_bridge_failure(
  error: RpcError,
): ArbitrumBridgeFailure | null {
  const direct = safeParse(BytesSchema, error.data)
  if (direct.success) {
    const decoded = decode_arbitrum_bridge_error(
      direct.output,
    )
    if (decoded === null) return null
    return new ArbitrumBridgeFailure(decoded)
  }
  const nested = safeParse(
    object({ data: string() }),
    error.data,
  )
  if (!nested.success) return null
  const inner = safeParse(BytesSchema, nested.output.data)
  if (!inner.success) return null
  const decoded = decode_arbitrum_bridge_error(inner.output)
  if (decoded === null) return null
  return new ArbitrumBridgeFailure(decoded)
}

// Transport-layer decorator: wraps any Reader so that an RPC
// error carrying a recognized Arbitrum-bridge custom-error
// selector becomes a thrown `ArbitrumBridgeFailure`.
// Unrecognized errors pass through unchanged. The OP-rollup
// sibling is `with_op_errors`; the zkSync sibling will be
// `with_zksync_errors`.
export function with_arbitrum_errors(
  reader: Reader,
): Reader {
  return async (call) => {
    const response = await reader(call)
    if ("error" in response) {
      const failure = try_decode_arbitrum_bridge_failure(
        response.error,
      )
      if (failure) throw failure
    }
    return response
  }
}
