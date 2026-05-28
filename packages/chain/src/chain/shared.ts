import type { InferOutput } from "valibot"
import {
  array,
  custom,
  literal,
  number,
  object,
  optional,
  string,
} from "valibot"

const FeatureSchema = object({
  name: string(),
})
export type Feature = InferOutput<typeof FeatureSchema>

const NativeCurrencySchema = object({
  name: string(),
  symbol: string(),
  decimals: number(),
})
export type NativeCurrency = InferOutput<
  typeof NativeCurrencySchema
>

const ExplorerSchema = object({
  name: string(),
  url: string(),
  standard: string(),
})
export type Explorer = InferOutput<typeof ExplorerSchema>

const BridgeSchema = object({
  url: string(),
})
export type Bridge = InferOutput<typeof BridgeSchema>

const ParentSchema = object({
  type: string(),
  chain: string(),
  bridges: optional(array(BridgeSchema)),
})
export type Parent = InferOutput<typeof ParentSchema>

const EnsRegistrySchema = object({
  registry: string(),
})
export type EnsRegistry = InferOutput<
  typeof EnsRegistrySchema
>

function isShortName(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[A-Za-z0-9-_]{1,64}$/.test(input)
  )
}
export const ShortNameSchema = custom<string>(isShortName)
export type ShortName = InferOutput<typeof ShortNameSchema>

const RedFlagSchema = literal("reusedChainId")
export type RedFlagSchema = InferOutput<
  typeof RedFlagSchema
>

export const ChainSchema = object({
  name: string(),
  shortName: ShortNameSchema,
  title: optional(string()),
  chain: string(),
  icon: optional(string()),
  rpc: array(string()),
  faucets: array(string()),
  features: optional(array(FeatureSchema)),
  nativeCurrency: NativeCurrencySchema,
  infoURL: string(),
  chainId: number(),
  networkId: number(),
  slip44: optional(number()),
  ens: optional(EnsRegistrySchema),
  explorers: optional(array(ExplorerSchema)),
  parent: optional(ParentSchema),
  status: optional(string()),
  redFlags: optional(array(RedFlagSchema)),
})
export type Chain = InferOutput<typeof ChainSchema>
