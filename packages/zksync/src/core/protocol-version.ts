// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Active protocol-version descriptor. Several upstream fields are
// `#[deprecated]` (the snake_case `version_id`,
// `verification_keys_hashes`, `base_system_contracts`, and the
// snake_case `l2_system_upgrade_tx_hash` duplicate) and not modeled
// here; Valibot's `object()` ignores unknown wire keys, so emitting
// them upstream does not break validation.

import {
  Hash32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object, optional } from "valibot"

export const ProtocolVersionSchema = object({
  minorVersion: optional(nullable(Uint64Schema)),
  timestamp: Uint64Schema,
  bootloaderCodeHash: optional(nullable(Hash32Schema)),
  defaultAccountCodeHash: optional(nullable(Hash32Schema)),
  evmSimulatorCodeHash: optional(nullable(Hash32Schema)),
  l2SystemUpgradeTxHash: optional(nullable(Hash32Schema)),
})
export type ProtocolVersion = InferOutput<
  typeof ProtocolVersionSchema
>
