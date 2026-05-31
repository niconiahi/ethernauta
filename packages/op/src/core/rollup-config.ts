// https://github.com/ethereum-optimism/optimism/blob/develop/op-node/rollup/types.go

import { AddressSchema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  integer,
  minValue,
  number,
  object,
  optional,
  pipe,
  string,
} from "valibot"

import { GenesisSchema } from "./genesis"

// All numeric fields below are plain uint64 / *uint64 /
// *big.Int — encoding/json emits JSON decimal numbers.
// Hardfork timestamp pointers are absent when the fork has
// not been scheduled on the queried chain; mark them all
// optional so we parse cleanly against any OP Stack chain.
const Uint64NumberSchema = pipe(
  number(),
  integer(),
  minValue(0),
)

// op-geth params.OptimismConfig
const OptimismConfigSchema = object({
  eip1559Elasticity: Uint64NumberSchema,
  eip1559Denominator: Uint64NumberSchema,
  eip1559DenominatorCanyon: optional(Uint64NumberSchema),
})

// op-node/rollup AltDAConfig
const AltDAConfigSchema = object({
  da_challenge_contract_address: optional(AddressSchema),
  da_commitment_type: string(),
  da_challenge_window: Uint64NumberSchema,
  da_resolve_window: Uint64NumberSchema,
})

export const RollupConfigSchema = object({
  genesis: GenesisSchema,
  block_time: Uint64NumberSchema,
  max_sequencer_drift: optional(Uint64NumberSchema),
  seq_window_size: Uint64NumberSchema,
  channel_timeout: Uint64NumberSchema,
  l1_chain_id: Uint64NumberSchema,
  l2_chain_id: Uint64NumberSchema,
  regolith_time: optional(Uint64NumberSchema),
  canyon_time: optional(Uint64NumberSchema),
  delta_time: optional(Uint64NumberSchema),
  ecotone_time: optional(Uint64NumberSchema),
  fjord_time: optional(Uint64NumberSchema),
  granite_time: optional(Uint64NumberSchema),
  holocene_time: optional(Uint64NumberSchema),
  isthmus_time: optional(Uint64NumberSchema),
  jovian_time: optional(Uint64NumberSchema),
  karst_time: optional(Uint64NumberSchema),
  interop_time: optional(Uint64NumberSchema),
  pectra_blob_schedule_time: optional(Uint64NumberSchema),
  batch_inbox_address: AddressSchema,
  deposit_contract_address: AddressSchema,
  l1_system_config_address: AddressSchema,
  chain_op_config: optional(OptimismConfigSchema),
  alt_da: optional(AltDAConfigSchema),
})
export type RollupConfig = InferOutput<
  typeof RollupConfigSchema
>
