import type { Http } from "@ethernauta/transport"
import {
  type ChainEntry,
  chainIdSchema,
  require_chain,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import type { Store } from "./store"

export const trackContextSchema = object({
  chain_id: chainIdSchema,
})
type TrackInput = InferOutput<typeof trackContextSchema>

/**
 * The resolved tracker context — what the four verbs receive
 * when the user calls `tracker({ chain_id })`. Includes the
 * store on top of the standard chain_id read context so the
 * verbs can persist lifecycle records.
 */
export type TrackContext = TrackInput & { store: Store }

export type ResolvedTracker = [Http[], TrackContext]

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

export type TrackerConfig = {
  store: Store
}

export function create_tracker(
  chains: ChainEntry[],
  config: TrackerConfig,
): (_input: TrackInput) => ResolvedTracker {
  return (_input: TrackInput): ResolvedTracker => {
    const input = parse(trackContextSchema, _input)
    const transports = require_chain(chains, input.chain_id)
    return [
      transports,
      { chain_id: input.chain_id, store: config.store },
    ]
  }
}

export type Tracker = ReturnType<typeof create_tracker>
