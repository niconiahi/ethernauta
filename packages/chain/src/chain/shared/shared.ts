import type { InferOutput } from "valibot"
import {
  array,
  literal,
  number,
  object,
  optional,
  custom,
  string,
} from "valibot"

const featureSchema = object({
  name: string(),
})
export type Feature = InferOutput<typeof featureSchema>

const nativeCurrencySchema = object({
  name: string(),
  symbol: string(),
  decimals: number(),
})
export type NativeCurrency = InferOutput<
  typeof nativeCurrencySchema
>

const explorerSchema = object({
  name: string(),
  url: string(),
  standard: string(),
})
export type Explorer = InferOutput<typeof explorerSchema>

const bridgeSchema = object({
  url: string(),
})
export type Bridge = InferOutput<typeof bridgeSchema>

const parentSchema = object({
  type: string(),
  chain: string(),
  bridges: optional(array(bridgeSchema)),
})
export type Parent = InferOutput<typeof parentSchema>

const ensRegistrySchema = object({
  registry: string(),
})
export type EnsRegistry = InferOutput<
  typeof ensRegistrySchema
>

function isShortName(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[A-Za-z0-9-_]{1,64}$/.test(input)
  )
}
export const shortNameSchema = custom<string>(isShortName)
export type ShortName = InferOutput<typeof shortNameSchema>

const redFlagSchema = literal("reusedChainId")
export type RedFlagSchema = InferOutput<
  typeof redFlagSchema
>

export const chainSchema = object({
  name: string(),
  shortName: shortNameSchema,
  title: optional(string()),
  chain: string(),
  icon: optional(string()),
  rpc: array(string()),
  faucets: array(string()),
  features: optional(array(featureSchema)),
  nativeCurrency: nativeCurrencySchema,
  infoURL: string(),
  chainId: number(),
  networkId: number(),
  slip44: optional(number()),
  ens: optional(ensRegistrySchema),
  explorers: optional(array(explorerSchema)),
  parent: optional(parentSchema),
  status: optional(string()),
  redFlags: optional(array(redFlagSchema)),
})
export type Chain = InferOutput<typeof chainSchema>
