// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/contracts/src/lib.rs
// The (bootloader, default-AA, evm-emulator) triple identifying the
// bootloader and default account-abstraction code in use at a given
// protocol version.

import { Hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object, optional } from "valibot"

export const BaseSystemContractsHashesSchema = object({
  bootloader: Hash32Schema,
  default_aa: Hash32Schema,
  evm_emulator: optional(nullable(Hash32Schema)),
})
export type BaseSystemContractsHashes = InferOutput<
  typeof BaseSystemContractsHashesSchema
>
