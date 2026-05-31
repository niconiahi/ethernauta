// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// One Merkle-trie proof step for a storage slot at a sealed L1
// batch. `key` is the slot key; `proof` is the sibling-hash path;
// `value` is the slot value at that batch; `index` is the trie
// position used by the verifier.

import {
  Hash32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

export const StorageProofSchema = object({
  key: Hash32Schema,
  proof: array(Hash32Schema),
  value: Hash32Schema,
  index: Uint64Schema,
})
export type StorageProof = InferOutput<
  typeof StorageProofSchema
>
