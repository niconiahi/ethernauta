// Public config shape for `test(config?)` and (Phase 5) for
// `ethernauta_anvil(options?)`. The `fork` slot is reserved here
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
  pipe,
  string,
  url,
} from "valibot"

// `fork.url` is the raw RPC string anvil consumes via
// `--fork-url`. Phase 6 (the simulation plan's OQ6) will extend
// this with a `{ chain_id }` form that resolves the URL via
// `@ethernauta/chain`; for now we require a syntactically valid
// URL so a typo throws at the parse boundary, before anvil
// spawns and fails with a less actionable error.

export const ForkConfigSchema = object({
  url: pipe(string(), url()),
  block_number: optional(bigint()),
})
export type ForkConfig = InferOutput<
  typeof ForkConfigSchema
>

export const TestConfigSchema = object({
  chain_id: optional(number()),
  accounts: optional(number()),
  mnemonic: optional(string()),
  block_time: optional(number()),
  base_fee: optional(bigint()),
  hardfork: optional(string()),
  fork: optional(ForkConfigSchema),
  port: optional(number()),
  extra_args: optional(array(string())),
  isolate: optional(boolean()),
})
export type TestConfig = InferOutput<
  typeof TestConfigSchema
>
