import { type Bytes, bytesSchema } from "@ethernauta/core"
import { bytes_to_hex, hex_to_bytes } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  bigint,
  literal,
  object,
  string,
  union,
} from "valibot"

import { string_, uint256 } from "./leaves"

const ERROR_SELECTOR = "0x08c379a0"
const PANIC_SELECTOR = "0x4e487b71"

export const revertReasonSchema = union([
  object({ kind: literal("empty") }),
  object({ kind: literal("error"), reason: string() }),
  object({ kind: literal("panic"), code: bigint() }),
  object({
    kind: literal("custom"),
    selector: bytesSchema,
    data: bytesSchema,
  }),
])
export type RevertReason = InferOutput<
  typeof revertReasonSchema
>

export function decode_revert_reason(
  _data: Bytes | undefined | null,
): RevertReason {
  if (!_data || _data === "0x") return { kind: "empty" }
  const bytes = hex_to_bytes(_data)
  if (bytes.length < 4) return { kind: "empty" }
  const selector_hex = bytes_to_hex(bytes.slice(0, 4))
  const payload = bytes.slice(4)
  if (selector_hex === ERROR_SELECTOR) {
    const reason = string_().decode(payload, 32)
    return { kind: "error", reason }
  }
  if (selector_hex === PANIC_SELECTOR) {
    const code = uint256().decode(payload, 0)
    return { kind: "panic", code }
  }
  return {
    kind: "custom",
    selector: selector_hex,
    data: bytes_to_hex(payload),
  }
}
