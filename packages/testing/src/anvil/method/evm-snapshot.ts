// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `evm_snapshot` freezes the current EVM state and returns an
// opaque snapshot id that can be passed to `evm_revert` to roll
// the chain back to this point. Anvil returns a hex-encoded
// integer; we parse with `BytesSchema` because the width is not
// fixed by the spec and the value is always treated as an opaque
// handle.

import { BytesSchema, type Bytes } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function evm_snapshot(): Readable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "evm_snapshot"
    const call = parse(CallSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return result
  }
}
