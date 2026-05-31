// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Lifecycle fields shared between `BlockDetails` (L2 block) and
// `L1BatchDetails`. Upstream merges them via `#[serde(flatten)]`
// so the wire emits all of these inline on the parent object.
// Datetime fields are RFC 3339 strings.

import {
  Hash32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object, optional, string } from "valibot"

import { BaseSystemContractsHashesSchema } from "./base-system-contracts-hashes"
import { BlockStatusSchema } from "./block-status"
import { EthTxFinalityStatusSchema } from "./eth-tx-finality-status"

export const BlockDetailsBaseSchema = object({
  timestamp: Uint64Schema,
  l1TxCount: Uint64Schema,
  l2TxCount: Uint64Schema,
  rootHash: nullable(Hash32Schema),
  status: BlockStatusSchema,
  commitTxHash: nullable(Hash32Schema),
  committedAt: nullable(string()),
  commitTxFinality: optional(
    nullable(EthTxFinalityStatusSchema),
  ),
  commitChainId: optional(nullable(Uint64Schema)),
  proveTxHash: nullable(Hash32Schema),
  proveTxFinality: optional(
    nullable(EthTxFinalityStatusSchema),
  ),
  provenAt: nullable(string()),
  proveChainId: optional(nullable(Uint64Schema)),
  executeTxHash: nullable(Hash32Schema),
  executeTxFinality: optional(
    nullable(EthTxFinalityStatusSchema),
  ),
  executedAt: nullable(string()),
  executeChainId: optional(nullable(Uint64Schema)),
  precommitTxHash: optional(nullable(Hash32Schema)),
  precommitTxFinality: optional(
    nullable(EthTxFinalityStatusSchema),
  ),
  precommittedAt: optional(nullable(string())),
  precommitChainId: optional(nullable(Uint64Schema)),
  l1GasPrice: Uint64Schema,
  l2FairGasPrice: Uint64Schema,
  fairPubdataPrice: optional(nullable(Uint64Schema)),
  baseSystemContractsHashes:
    BaseSystemContractsHashesSchema,
})
export type BlockDetailsBase = InferOutput<
  typeof BlockDetailsBaseSchema
>
