// https://github.com/ethereum-optimism/optimism/blob/develop/op-node/rollup/types.go

import { Hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  integer,
  minValue,
  number,
  object,
  pipe,
} from "valibot"

import { SystemConfigSchema } from "./system-config"

// Genesis is NOT custom-marshaled — fields use Go's default
// encoding/json, so plain uint64 renders as a JSON decimal
// number (in contrast to L1BlockRef / L2BlockRef which
// hexutil-marshal their numeric fields).
const Uint64NumberSchema = pipe(
  number(),
  integer(),
  minValue(0),
)

const GenesisBlockIDSchema = object({
  hash: Hash32Schema,
  number: Uint64NumberSchema,
})

export const GenesisSchema = object({
  l1: GenesisBlockIDSchema,
  l2: GenesisBlockIDSchema,
  l2_time: Uint64NumberSchema,
  system_config: SystemConfigSchema,
})
export type Genesis = InferOutput<typeof GenesisSchema>
