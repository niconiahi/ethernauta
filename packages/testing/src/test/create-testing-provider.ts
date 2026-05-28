// `create_testing_provider(url)` returns an EIP-1193
// `Provider` for the anvil running at `url`. Compose with
// `create_provider` from `@ethernauta/transport` to obtain
// the resolver pair — the call shape then mirrors the
// production pattern `create_provider(window.ethereum)`.
//
//   import { create_testing_provider, anvil } from "@ethernauta/testing"
//   import { create_provider } from "@ethernauta/transport"
//
//   const resolver = create_provider(create_testing_provider(anvil()))
//   eth_getBalance(addr)(resolver.reader({ chain_id }))
//   eth_sendTransaction(tx)(resolver.signer({ chain_id }))

import { create_provider } from "@ethernauta/eip/1193"
import type { Provider } from "@ethernauta/eip/1193"
import { CallSchema, http } from "@ethernauta/transport"
import { parse } from "valibot"

export function create_testing_provider(
  url: string,
): Provider {
  const transport = http(url)
  return create_provider({
    request: async ({ method, params }) => {
      const call = parse(
        CallSchema,
        params === undefined ? [method] : [method, params],
      )
      const response = await transport(call)
      if ("error" in response) {
        throw response.error
      }
      return response.result
    },
  })
}
