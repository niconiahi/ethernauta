// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Interop proof source. Single variant today (`ProofBasedGateway`);
// the picklist is locked so future variants land as a wider set.

import type { InferOutput } from "valibot"
import { picklist } from "valibot"

export const InteropModeSchema = picklist([
  "ProofBasedGateway",
])
export type InteropMode = InferOutput<
  typeof InteropModeSchema
>
