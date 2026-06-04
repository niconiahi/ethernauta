// https://docs.ens.domains/ensip/10 — parent-walk to locate
// the resolver responsible for a name. For ENSIP-10 wildcard
// resolvers (basenames, L2 ENS) the resolver lives at a
// parent of the queried name; callers need both the resolver
// address and the parent at which it was found so they know
// whether to use the legacy `addr(node)` path or ENSIP-10's
// `resolve(name, data)`.

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import { eth_call_ccip } from "@ethernauta/eip/3668"
import {
  get_registry_address,
  namehash,
  resolver as resolver_method,
  ZERO_ADDRESS,
} from "@ethernauta/erc/137"
import type { ResolvedReader } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, string } from "valibot"

export const FindResolverResultSchema = object({
  resolver: AddressSchema,
  found_at: string(),
})
export type FindResolverResult = InferOutput<
  typeof FindResolverResultSchema
>

// Input MUST already be normalized (ENSIP-15). This helper
// is internal to `resolution/` and trusts its caller.
export async function find_resolver(
  _normalized_name: string,
  _registry_override: Address | undefined,
  [dispatcher, context]: ResolvedReader,
): Promise<FindResolverResult | null> {
  const registry = get_registry_address(
    context.chain_id,
    _registry_override,
  )
  const labels =
    _normalized_name.length === 0
      ? []
      : _normalized_name.split(".")
  for (let i = 0; i <= labels.length; i += 1) {
    const candidate = labels.slice(i).join(".")
    const node = namehash(candidate)
    const call = resolver_method({ node })({
      chain_id: context.chain_id,
      to: registry,
    })
    const raw = await eth_call_ccip({
      to: call.to,
      input: call.data,
    })([dispatcher, context])
    const decoded = call.decode(raw)
    if (decoded !== ZERO_ADDRESS) {
      return { resolver: decoded, found_at: candidate }
    }
  }
  return null
}
