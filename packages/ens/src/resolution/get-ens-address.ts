// https://docs.ens.domains/resolvers/interfaces — forward
// resolution: name -> address.

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import {
  addr,
  get_registry_address,
  namehash,
  normalize,
  resolver,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import { eth_call_ccip } from "@ethernauta/eip/3668"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse, string } from "valibot"

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
    const node = namehash(normalize(parameters.name))
    const registry = get_registry_address(
      context.chain_id,
      parameters.registry,
    )
    const resolver_call = resolver({ node })({
      chain_id: context.chain_id,
      to: registry,
    })
    const resolver_raw = await eth_call_ccip({
      to: resolver_call.to,
      input: resolver_call.data,
    })([transports, context])
    const resolver_addr = resolver_call.decode(resolver_raw)
    if (resolver_addr === ZERO_ADDRESS) return null
    const addr_call = addr({ node })({
      chain_id: context.chain_id,
      to: resolver_addr,
    })
    const addr_raw = await eth_call_ccip({
      to: addr_call.to,
      input: addr_call.data,
    })([transports, context])
    const decoded = addr_call.decode(addr_raw)
    if (decoded === ZERO_ADDRESS) return null
    return decoded
  }
}
