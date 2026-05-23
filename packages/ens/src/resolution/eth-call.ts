// Internal helper — issue an `eth_call` against a given
// contract using already-resolved transports.

import type { Address, Bytes } from "@ethernauta/core"
import { bytesSchema } from "@ethernauta/core"
import type { Http } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export async function eth_call(
  _transports: Http[],
  _to: Address,
  _data: Bytes,
): Promise<Bytes> {
  const call = parse(callSchema, [
    "eth_call",
    [{ to: _to, input: _data }, "latest"],
  ])
  const response = await Promise.any(
    _transports.map((transport) => transport(call)),
  )
  if ("error" in response) {
    throw new Error(response.error.message)
  }
  return parse(bytesSchema, response.result)
}
