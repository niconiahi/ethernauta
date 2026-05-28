// https://docs.ens.domains/ensip/5 — text(node, key)

import { AddressSchema } from "@ethernauta/core"
import {
  get_registry_address,
  namehash,
  normalize,
  resolver,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import { text } from "@ethernauta/erc/634"
import { eth_call } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse, string } from "valibot"

const ParametersSchema = object({
  name: string(),
  key: string(),
  registry: optional(AddressSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function get_ens_text(
  _parameters: Parameters,
): Readable<string | null> {
  return async ([
    transports,
    context,
  ]: ResolvedReader): Promise<string | null> => {
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
    const resolver_raw = await eth_call([
      { to: resolver_call.to, input: resolver_call.data },
    ])([transports, context])
    const resolver_addr = resolver_call.decode(resolver_raw)
    if (resolver_addr === ZERO_ADDRESS) return null
    const text_call = text({ node, key: parameters.key })({
      chain_id: context.chain_id,
      to: resolver_addr,
    })
    const text_raw = await eth_call([
      { to: text_call.to, input: text_call.data },
    ])([transports, context])
    const decoded = text_call.decode(text_raw)
    if (decoded.length === 0) return null
    return decoded
  }
}
