// L1-side deployment data for zkSync-family chains. Discovered
// by reading the per-network Bridgehub anchor on the parent
// chain (see packages/zksync/scripts/pull-deploys.ts). The L2
// system contracts (NonceHolder, ContractDeployer, L1Messenger,
// BridgeHub-L2) are family-wide constants and live next to their
// ABIs under src/system-contracts/ — not here.
//
// Per-network singletons (`bridgehub`, `assetRouter`,
// `nativeTokenVault`, `l1Nullifier`, `messageRoot`, `ctmDeployer`,
// `wethToken`) are the same address across every hyperchain on a
// given parent. Per-chain fields (`diamondProxy`,
// `chainTypeManager`, `baseToken`) vary. The split keeps the
// generator file-shaped: one file per L2 chain, schema-validated.

import { AddressSchema } from "@ethernauta/core"
import {
  boolean,
  type InferOutput,
  number,
  object,
  string,
} from "valibot"

const ZksyncL1ContractsSchema = object({
  bridgehub: AddressSchema,
  assetRouter: AddressSchema,
  nativeTokenVault: AddressSchema,
  l1Nullifier: AddressSchema,
  messageRoot: AddressSchema,
  ctmDeployer: AddressSchema,
  wethToken: AddressSchema,
  diamondProxy: AddressSchema,
  chainTypeManager: AddressSchema,
  baseToken: AddressSchema,
})

export const ZksyncDeploysSchema = object({
  name: string(),
  parentChainId: number(),
  l1: ZksyncL1ContractsSchema,
  isTestnet: boolean(),
})
export type ZksyncDeploys = InferOutput<
  typeof ZksyncDeploysSchema
>
