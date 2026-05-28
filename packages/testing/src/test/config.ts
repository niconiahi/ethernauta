// Public config shape for `test(config?)` and (Phase 5) for
// `ethernautaAnvil(options?)`. The `fork` slot is reserved here
// for Phase 4; Phase 7 wires the remaining overrides through to
// the spawner's CLI assembly. Schemas are exported separately so
// the plugin (Phase 5) and the test() factory can compose them.

import type { InferOutput } from "valibot"
import {
  array,
  bigint,
  boolean,
  number,
  object,
  optional,
  string,
} from "valibot"

export const ForkConfigSchema = object({
  url: string(),
  blockNumber: optional(bigint()),
})
export type ForkConfig = InferOutput<typeof ForkConfigSchema>

export const TestConfigSchema = object({
  chainId: optional(number()),
  accounts: optional(number()),
  mnemonic: optional(string()),
  blockTime: optional(number()),
  baseFee: optional(bigint()),
  hardfork: optional(string()),
  fork: optional(ForkConfigSchema),
  port: optional(number()),
  extraArgs: optional(array(string())),
  isolate: optional(boolean()),
})
export type TestConfig = InferOutput<typeof TestConfigSchema>
