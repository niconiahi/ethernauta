// https://github.com/ethereum-optimism/superchain-registry — addresses.json shape
import { AddressSchema } from "@ethernauta/core"
import { type InferOutput, object, optional } from "valibot"

const OpContractsSchema = object({
  AddressManager: AddressSchema,
  AnchorStateRegistryProxy: AddressSchema,
  DelayedWETHProxy: AddressSchema,
  DisputeGameFactoryProxy: AddressSchema,
  // Added in op-contracts/v6.0.0 (see superchain-registry
  // validation/standard/standard-versions-mainnet.toml). Pre-v6
  // chains do not deploy it.
  EthLockboxProxy: optional(AddressSchema),
  // Required by the Standard Rollup Charter for a "standard chain"
  // but absent on chains still running permissioned-only dispute
  // games (pre-graduation from PermissionedDisputeGame).
  FaultDisputeGame: optional(AddressSchema),
  L1CrossDomainMessengerProxy: AddressSchema,
  L1ERC721BridgeProxy: AddressSchema,
  L1StandardBridgeProxy: AddressSchema,
  MIPS: AddressSchema,
  OptimismMintableERC20FactoryProxy: AddressSchema,
  OptimismPortalProxy: AddressSchema,
  PermissionedDisputeGame: AddressSchema,
  PreimageOracle: AddressSchema,
  ProxyAdmin: AddressSchema,
  SuperchainConfig: AddressSchema,
  SystemConfigProxy: AddressSchema,
})

const OpRolesSchema = object({
  BatchSubmitter: AddressSchema,
  Challenger: AddressSchema,
  Guardian: AddressSchema,
  Proposer: AddressSchema,
  ProxyAdminOwner: AddressSchema,
  SystemConfigOwner: AddressSchema,
  UnsafeBlockSigner: AddressSchema,
})

export const OpDeploysSchema = object({
  contracts: OpContractsSchema,
  roles: OpRolesSchema,
})
export type OpDeploys = InferOutput<typeof OpDeploysSchema>
