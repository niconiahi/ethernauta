// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `anvil_dumpState` serialises the entire anvil chain state to a
// 0x-prefixed hex blob that can be fed back into
// `anvil_loadState` to restore it. The blob is opaque to the
// consumer; do not parse it. Pair with `anvil_loadState` to
// snapshot across process restarts or to cache forked-fork state
// (see the sibling simulation plan).

import { BytesSchema, type Bytes } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function anvil_dumpState(): Readable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "anvil_dumpState"
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
