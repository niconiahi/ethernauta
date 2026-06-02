// https://github.com/OffchainLabs/arbitrum-sdk/blob/master/packages/sdk/src/lib/dataEntities/networks.ts
// Mirrors the `ArbitrumNetwork` shape upstream minus
// `tokenBridge`, `teleporter`, `nativeToken`, `retryableLifetimeSeconds`,
// and `isCustom`. The bridge-relevant L1 addresses
// (`inbox`, `l1GatewayRouter`, `l1Erc20Gateway`) live under
// `contracts` to mirror OP's `.contracts.<Proxy>` lookup shape —
// see `tmp/plans/05_bridge_package/01-scope.md` (Patterns locked
// by slice 2). The field is optional: only Arb One + Arb Sepolia
// are populated as of slice 3a; Orbit chains lag until later
// sub-slices need them.

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

const ArbitrumContractsSchema = object({
  inbox: AddressSchema,
  l1GatewayRouter: AddressSchema,
  l1Erc20Gateway: AddressSchema,
})

export const ArbitrumDeploysSchema = object({
  name: string(),
  parentChainId: number(),
  ethBridge: EthBridgeSchema,
  contracts: optional(ArbitrumContractsSchema),
  confirmPeriodBlocks: number(),
  isBold: optional(boolean()),
  isTestnet: boolean(),
})
export type ArbitrumDeploys = InferOutput<
  typeof ArbitrumDeploysSchema
>
