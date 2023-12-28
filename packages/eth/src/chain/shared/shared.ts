import type { Input } from "valibot"
import { array, literal, number, object, optional, special, string } from "valibot"

const featureSchema = object({
  name: string(),
})
export type Feature = Input<typeof featureSchema>

const nativeCurrencySchema = object({
  name: string(),
  symbol: string(),
  decimals: number(),
})
export type NativeCurrency = Input<typeof nativeCurrencySchema>

const explorerSchema = object({
  name: string(),
  url: string(),
  standard: string(),
})
export type Explorer = Input<typeof explorerSchema>

const bridgeSchema = object({
  url: string(),
})
export type Bridge = Input<typeof bridgeSchema>

const parentSchema = object({
  type: string(),
  chain: string(),
  bridges: optional(array(bridgeSchema)),
})
export type Parent = Input<typeof parentSchema>

const ensRegistrySchema = object({
  registry: string(),
})
export type EnsRegistry = Input<typeof ensRegistrySchema>

function isShortName(input: unknown): boolean {
  return typeof input === "string" && /^[A-Za-z0-9-_]{1,64}$/.test(input)
}
export const shortNameSchema = special<string>(isShortName)
export type ShortName = Input<typeof shortNameSchema >

const redFlagSchema = literal("reusedChainId")
export type RedFlagSchema = Input<typeof redFlagSchema>

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
export type Chain = Input<typeof chainSchema>
