// https://docs.ens.domains/resolvers/interfaces — forward
// resolution: name -> address. ENSIP-10 wildcard-aware:
// walks parent labels to find a resolver, then dispatches
// to legacy `addr(node)` for direct hits or to
// `resolve(dnsEncode(name), addr(node).calldata)` for
// wildcard hits (basenames, L2 ENS).

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import {
  addr,
  namehash,
  normalize,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import { supportsInterface } from "@ethernauta/erc/165"
import { eth_call_ccip } from "@ethernauta/eip/3668"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse, string } from "valibot"

import {
  dns_encode,
  ENSIP10_INTERFACE_ID,
  resolve,
} from "../ensip-10"
import { find_resolver } from "./find-resolver"

const ParametersSchema = object({
  name: string(),
  registry: optional(AddressSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function get_ens_address(
  _parameters: Parameters,
): Readable<Address | null> {
  return async ([
    transports,
    context,
  ]: ResolvedReader): Promise<Address | null> => {
    const parameters = parse(ParametersSchema, _parameters)
    const name = normalize(parameters.name)
    const found = await find_resolver(
      name,
      parameters.registry,
      [transports, context],
    )
    if (found === null) return null
    const node = namehash(name)
    const addr_call = addr({ node })({
      chain_id: context.chain_id,
      to: found.resolver,
    })
    if (found.found_at === name) {
      const raw = await eth_call_ccip({
        to: addr_call.to,
        input: addr_call.data,
      })([transports, context])
      const decoded = addr_call.decode(raw)
      if (decoded === ZERO_ADDRESS) return null
      return decoded
    }
    const supports_call = supportsInterface({
      interfaceId: ENSIP10_INTERFACE_ID,
    })({
      chain_id: context.chain_id,
      to: found.resolver,
    })
    const supports_raw = await eth_call_ccip({
      to: supports_call.to,
      input: supports_call.data,
    })([transports, context])
    if (!supports_call.decode(supports_raw)) return null
    const resolve_call = resolve({
      name: dns_encode(name),
      data: addr_call.data,
    })({
      chain_id: context.chain_id,
      to: found.resolver,
    })
    const resolve_raw = await eth_call_ccip({
      to: resolve_call.to,
      input: resolve_call.data,
    })([transports, context])
    const inner = resolve_call.decode(resolve_raw)
    const decoded = addr_call.decode(inner)
    if (decoded === ZERO_ADDRESS) return null
    return decoded
  }
}
