// https://github.com/OffchainLabs/arbitrum-sdk/blob/master/packages/sdk/src/lib/dataEntities/networks.ts
// Mirrors the `ArbitrumNetwork` shape upstream minus
// `tokenBridge`, `teleporter`, `nativeToken`, `retryableLifetimeSeconds`,
// `isCustom`, and the `inbox` address (the Rollup contract at
// nitro-contracts v3.2.0 does not expose `inbox()` — the delayed
// inbox is discovered via `bridge.allowedDelayedInboxList(0)`; the
// field + the two-hop discovery land in phase 05 when `Bridgable<T>`
// is designed).

import { AddressSchema } from "@ethernauta/core"
import {
  boolean,
  type InferOutput,
  number,
  object,
  optional,
  record,
  string,
} from "valibot"

const EthBridgeSchema = object({
  bridge: AddressSchema,
  sequencerInbox: AddressSchema,
  outbox: AddressSchema,
  rollup: AddressSchema,
  classicOutboxes: optional(
    record(AddressSchema, number()),
  ),
})

export const ArbitrumDeploysSchema = object({
  name: string(),
  parentChainId: number(),
  ethBridge: EthBridgeSchema,
  confirmPeriodBlocks: number(),
  isBold: optional(boolean()),
  isTestnet: boolean(),
})
export type ArbitrumDeploys = InferOutput<
  typeof ArbitrumDeploysSchema
>
