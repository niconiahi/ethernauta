// https://docs.ens.domains/web/reverse — reverse
// resolution: address -> name, with forward verification.

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import {
  addr,
  get_registry_address,
  namehash,
  resolver,
  reverse_namehash,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import { name as name_method } from "@ethernauta/erc/181"
import { eth_call_ccip } from "@ethernauta/eip/3668"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"

const ParametersSchema = object({
  address: AddressSchema,
  registry: optional(AddressSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function get_ens_name(
  _parameters: Parameters,
): Readable<string | null> {
  return async ([
    dispatcher,
    context,
  ]: ResolvedReader): Promise<string | null> => {
    const parameters = parse(ParametersSchema, _parameters)
    const registry = get_registry_address(
      context.chain_id,
      parameters.registry,
    )
    const reverse_node = reverse_namehash(
      parameters.address,
    )
    const resolver_call = resolver({ node: reverse_node })({
      chain_id: context.chain_id,
      to: registry,
    })
    const resolver_raw = await eth_call_ccip({
      to: resolver_call.to,
      input: resolver_call.data,
    })([dispatcher, context])
    const resolver_addr = resolver_call.decode(resolver_raw)
    if (resolver_addr === ZERO_ADDRESS) return null
    const name_call = name_method({ node: reverse_node })({
      chain_id: context.chain_id,
      to: resolver_addr,
    })
    const name_raw = await eth_call_ccip({
      to: name_call.to,
      input: name_call.data,
    })([dispatcher, context])
    const candidate = name_call.decode(name_raw)
    if (candidate.length === 0) return null
    const forward = await forward_resolve(
      [dispatcher, context],
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
  resolved: ResolvedReader,
  registry: Address,
  name: string,
): Promise<Address | null> {
  const [dispatcher, context] = resolved
  const node = namehash(name)
  const resolver_call = resolver({ node })({
    chain_id: context.chain_id,
    to: registry,
  })
  const resolver_raw = await eth_call_ccip({
    to: resolver_call.to,
    input: resolver_call.data,
  })([dispatcher, context])
  const resolver_addr = resolver_call.decode(resolver_raw)
  if (resolver_addr === ZERO_ADDRESS) return null
  const addr_call = addr({ node })({
    chain_id: context.chain_id,
    to: resolver_addr,
  })
  const addr_raw = await eth_call_ccip({
    to: addr_call.to,
    input: addr_call.data,
  })([dispatcher, context])
  const decoded = addr_call.decode(addr_raw)
  if (decoded === ZERO_ADDRESS) return null
  return decoded
}
