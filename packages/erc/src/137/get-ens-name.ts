// https://docs.ens.domains/web/reverse — reverse
// resolution: address -> name, with forward verification.

import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import type {
  ChainId,
  Http,
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"

import { eth_call } from "./eth-call"
import { addr } from "./methods/addr"
import { name as name_method } from "./methods/name"
import { resolver } from "./methods/resolver"
import { namehash, reverse_namehash } from "./namehash"
import {
  get_registry_address,
  ZERO_ADDRESS,
} from "./registry"

const parametersSchema = object({
  address: addressSchema,
  registry: optional(addressSchema),
})
type Parameters = InferOutput<typeof parametersSchema>

export function get_ens_name(
  _parameters: Parameters,
): Readable<string | null> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<string | null> => {
    const parameters = parse(parametersSchema, _parameters)
    const registry = get_registry_address(
      _context.chain_id,
      parameters.registry,
    )
    const reverse_node = reverse_namehash(
      parameters.address,
    )
    const resolver_call = resolver({ node: reverse_node })({
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
    const name_call = name_method({ node: reverse_node })({
      chain_id: _context.chain_id,
      to: resolver_addr,
    })
    const name_raw = await eth_call(
      transports,
      name_call.to,
      name_call.data,
    )
    const candidate = name_call.decode(name_raw)
    if (candidate.length === 0) return null
    const forward = await forward_resolve(
      transports,
      _context.chain_id,
      registry,
      candidate,
    )
    if (forward === null) return null
    const original = parameters.address.toLowerCase()
    if (forward.toLowerCase() !== original) return null
    return candidate
  }
}

async function forward_resolve(
  _transports: Http[],
  _chain_id: ChainId,
  _registry: Address,
  _name: string,
): Promise<Address | null> {
  const node = namehash(_name)
  const resolver_call = resolver({ node })({
    chain_id: _chain_id,
    to: _registry,
  })
  const resolver_raw = await eth_call(
    _transports,
    resolver_call.to,
    resolver_call.data,
  )
  const resolver_addr = resolver_call.decode(resolver_raw)
  if (resolver_addr === ZERO_ADDRESS) return null
  const addr_call = addr({ node })({
    chain_id: _chain_id,
    to: resolver_addr,
  })
  const addr_raw = await eth_call(
    _transports,
    addr_call.to,
    addr_call.data,
  )
  const decoded = addr_call.decode(addr_raw)
  if (decoded === ZERO_ADDRESS) return null
  return decoded
}
