// https://docs.ens.domains/registry/ens — registry.resolver

import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import {
  get_registry_address,
  namehash,
  normalize,
  resolver,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import { eth_call } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse, string } from "valibot"

const parametersSchema = object({
  name: string(),
  registry: optional(addressSchema),
})
type Parameters = InferOutput<typeof parametersSchema>

export function get_ens_resolver(
  _parameters: Parameters,
): Readable<Address | null> {
  return async ([
    transports,
    context,
  ]: ResolvedReader): Promise<Address | null> => {
    const parameters = parse(parametersSchema, _parameters)
    const node = namehash(normalize(parameters.name))
    const registry = get_registry_address(
      context.chain_id,
      parameters.registry,
    )
    const callable = resolver({ node })({
      chain_id: context.chain_id,
      to: registry,
    })
    const raw = await eth_call([
      { to: callable.to, input: callable.data },
    ])([transports, context])
    const decoded = callable.decode(raw)
    if (decoded === ZERO_ADDRESS) return null
    return decoded
  }
}
