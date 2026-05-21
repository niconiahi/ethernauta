// https://docs.ens.domains/resolvers/interfaces — forward
// resolution: name -> address.

import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  optional,
  parse,
  string,
} from "valibot"

import { eth_call } from "./eth-call"
import { addr } from "./methods/addr"
import { resolver } from "./methods/resolver"
import { namehash } from "./namehash"
import { normalize } from "./normalize"
import {
  get_registry_address,
  ZERO_ADDRESS,
} from "./registry"

const parametersSchema = object({
  name: string(),
  registry: optional(addressSchema),
})
type Parameters = InferOutput<typeof parametersSchema>

export function get_ens_address(
  _parameters: Parameters,
): Readable<Address | null> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Address | null> => {
    const parameters = parse(parametersSchema, _parameters)
    const node = namehash(normalize(parameters.name))
    const registry = get_registry_address(
      _context.chain_id,
      parameters.registry,
    )
    const resolver_call = resolver({ node })({
      chain_id: _context.chain_id,
      to: registry,
    })
    const resolver_raw = await eth_call(
      transports,
      resolver_call.to,
      resolver_call.data,
    )
    const resolver_addr = resolver_call.decode(resolver_raw)
    if (resolver_addr === ZERO_ADDRESS) return null
    const addr_call = addr({ node })({
      chain_id: _context.chain_id,
      to: resolver_addr,
    })
    const addr_raw = await eth_call(
      transports,
      addr_call.to,
      addr_call.data,
    )
    const decoded = addr_call.decode(addr_raw)
    if (decoded === ZERO_ADDRESS) return null
    return decoded
  }
}
