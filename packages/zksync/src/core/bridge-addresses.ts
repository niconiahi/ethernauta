// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Default L1/L2 bridge contracts the node knows about. Each
// address is independently optional — older deployments don't
// expose the legacy shared bridge, ETH-only chains skip the
// WETH bridge, etc.

import { AddressSchema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

export const BridgeAddressesSchema = object({
  l1SharedDefaultBridge: nullable(AddressSchema),
  l2SharedDefaultBridge: nullable(AddressSchema),
  l1Erc20DefaultBridge: nullable(AddressSchema),
  l2Erc20DefaultBridge: nullable(AddressSchema),
  l1WethBridge: nullable(AddressSchema),
  l2WethBridge: nullable(AddressSchema),
  l2LegacySharedBridge: nullable(AddressSchema),
})
export type BridgeAddresses = InferOutput<
  typeof BridgeAddressesSchema
>
