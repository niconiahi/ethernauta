import {
  type ChainEntry,
  ChainIdSchema,
  create_dispatcher,
  type Reader,
  require_chain,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import type { Store } from "./store"

export const TrackContextSchema = object({
  chain_id: ChainIdSchema,
})
type TrackInput = InferOutput<typeof TrackContextSchema>

/**
 * The resolved tracker context — what the four verbs receive
 * when the user calls `tracker({ chain_id })`. Includes the
 * store on top of the standard chain_id read context so the
 * verbs can persist lifecycle records.
 */
export type TrackContext = TrackInput & { store: Store }

export type ResolvedTracker = [Reader, TrackContext]

/**
 * Verbs that complete with a value go through this shape.
 * Same as `Readable<T>` from transport, but takes the wider
 * tracker context. A tracker-resolved tuple is structurally
 * compatible with `ResolvedReader`, so verbs can compose
 * with `eth_*` primitives internally.
 */
export type Trackable<T> = (
  _resolved: ResolvedTracker,
) => Promise<T>

/**
 * Subscription-shaped verbs (`watch_transaction`) return an
 * unsubscribe function on the second call. The polling loop
 * self-terminates when the receipt arrives, but `unsubscribe`
 * lets the caller (e.g. a React component) tear down before
 * that — useful for `useEffect` cleanup so unmounted components
 * don't fire `setState`.
 */
export type Watchable = (
  _resolved: ResolvedTracker,
) => () => void

// Carries a function-bearing strategy (`Store`) — kept as a
// Readonly intersection because Valibot cannot type per-call
// method signatures.
export type TrackerConfig = Readonly<{
  store: Store
}>

export function create_tracker(
  chains: ChainEntry[],
  config: TrackerConfig,
): (_input: TrackInput) => ResolvedTracker {
  return (_input: TrackInput): ResolvedTracker => {
    const input = parse(TrackContextSchema, _input)
    const { transports, strategy } = require_chain(
      chains,
      input.chain_id,
    )
    return [
      create_dispatcher(transports, strategy),
      { chain_id: input.chain_id, store: config.store },
    ]
  }
}

export type Tracker = ReturnType<typeof create_tracker>
