// https://eips.ethereum.org/EIPS/eip-1193

import type {
  ReadContext,
  ResolvedReader,
  ResolvedSigner,
  SignContext,
} from "@ethernauta/transport"
import { ReadContextSchema } from "@ethernauta/transport"
import { parse, safeParse } from "valibot"
import { addEthereumChainParametersSchema } from "../3085/method/wallet_addEthereumChain"
import { switchEthereumChainParametersSchema } from "../3326/method/wallet_switchEthereumChain"
import {
  invalid_params,
  unrecognized_chain,
  unsupported_method,
} from "./error"
import {
  type Emitter,
  create_emitter,
  type EventMap,
  type EventName,
} from "./events"
import {
  create_injected_signer,
  create_injected_transport,
} from "./inject"

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export type SignableHandler = (
  args: RequestArguments,
) => Promise<unknown>

export interface Provider {
  request(args: RequestArguments): Promise<unknown>
  on<E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ): void
  removeListener<E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ): void
}

export interface ProviderInternal extends Provider {
  emit: Emitter["emit"]
  set_active_chain(chain_id: string): void
  set_accounts(accounts: string[]): void
  get_active_chain(): string
  get_accounts(): string[]
  add_chain(chain_id: string): void
  has_chain(chain_id: string): boolean
}

export type CreateProviderOptions = {
  chains: string[]
  on_signable_request?: SignableHandler
}

const READ_ONLY_METHODS = new Set([
  "eth_chainId",
  "net_version",
  "eth_accounts",
  "wallet_getCapabilities",
  "wallet_getPermissions",
])

const LOCAL_CHAIN_METHODS = new Set([
  "wallet_switchEthereumChain",
])

// EIP-5792 atomic-batch methods. EOA wallets can't execute
// calls atomically (that requires smart-account infra), so
// we reject these cleanly. wallet_getCapabilities advertises
// the empty set so dapps know to fall back to per-tx flows.
const REJECTED_METHODS = new Set([
  "wallet_sendCalls",
  "wallet_getCallsStatus",
  "wallet_showCallsStatus",
])

function extract_switch_chain_id(
  params: RequestArguments["params"],
): string {
  const result = safeParse(
    switchEthereumChainParametersSchema,
    params,
  )
  if (!result.success)
    throw invalid_params(
      "wallet_switchEthereumChain expects [{ chainId }]",
    )
  return result.output[0].chainId
}

function extract_added_chain_id(
  params: RequestArguments["params"],
): string | undefined {
  const result = safeParse(
    addEthereumChainParametersSchema,
    params,
  )
  if (!result.success) return undefined
  return result.output[0].chainId
}

function chain_id_to_decimal(hex: string): string {
  if (!hex.startsWith("0x"))
    throw invalid_params(`expected 0x-prefixed hex: ${hex}`)
  return BigInt(hex).toString(10)
}

export function create_envelope(
  options: CreateProviderOptions,
): ProviderInternal {
  const { on_signable_request } = options
  const known_chains = new Set<string>(options.chains)
  let active_chain_id = options.chains[0] ?? "0x1"
  let accounts: string[] = []
  const emitter = create_emitter()

  function get_capabilities(): Record<string, object> {
    // https://eips.ethereum.org/EIPS/eip-5792
    // EOA wallet — advertises no capabilities. Returning {}
    // is the correct "I'm 5792-aware but feature-empty"
    // answer; throwing 4200 would mark us as ancient.
    return {}
  }

  function get_permissions(): Array<{
    parentCapability: string
    caveats: Array<{ type: string; value: unknown }>
  }> {
    // https://eips.ethereum.org/EIPS/eip-2255
    // We only model `eth_accounts`. Empty when not
    // connected, populated with the cached accounts as a
    // `restrictReturnedAccounts` caveat when connected.
    if (accounts.length === 0) return []
    return [
      {
        parentCapability: "eth_accounts",
        caveats: [
          {
            type: "restrictReturnedAccounts",
            value: accounts,
          },
        ],
      },
    ]
  }

  function set_active_chain(chain_id: string) {
    if (chain_id === active_chain_id) return
    active_chain_id = chain_id
    emitter.emit("chainChanged", chain_id)
  }

  function update_accounts(next: string[]) {
    const changed =
      next.length !== accounts.length ||
      next.some((a, i) => a !== accounts[i])
    accounts = next
    if (changed) emitter.emit("accountsChanged", next)
  }

  async function request_local(
    args: RequestArguments,
  ): Promise<unknown> {
    switch (args.method) {
      case "eth_chainId": {
        return active_chain_id
      }
      case "net_version": {
        return chain_id_to_decimal(active_chain_id)
      }
      case "eth_accounts": {
        return accounts
      }
      case "wallet_getCapabilities": {
        return get_capabilities()
      }
      case "wallet_getPermissions": {
        return get_permissions()
      }
      case "wallet_switchEthereumChain": {
        const target = extract_switch_chain_id(args.params)
        if (!known_chains.has(target))
          throw unrecognized_chain(target)
        set_active_chain(target)
        return null
      }
      default: {
        throw unsupported_method(args.method)
      }
    }
  }

  async function request(
    args: RequestArguments,
  ): Promise<unknown> {
    if (REJECTED_METHODS.has(args.method)) {
      throw unsupported_method(args.method)
    }
    if (
      READ_ONLY_METHODS.has(args.method) ||
      LOCAL_CHAIN_METHODS.has(args.method)
    ) {
      return request_local(args)
    }
    if (!on_signable_request) {
      throw unsupported_method(args.method)
    }
    if (args.method === "wallet_requestPermissions") {
      const next = await on_signable_request({
        method: "eth_requestAccounts",
      })
      const accounts_next = Array.isArray(next)
        ? (next as string[])
        : []
      update_accounts(accounts_next)
      return get_permissions()
    }
    const result = await on_signable_request(args)
    if (args.method === "eth_requestAccounts") {
      const next = Array.isArray(result)
        ? (result as string[])
        : []
      update_accounts(next)
    }
    if (args.method === "wallet_addEthereumChain") {
      const target = extract_added_chain_id(args.params)
      if (target) known_chains.add(target)
    }
    return result
  }

  return {
    request,
    on: emitter.on,
    removeListener: emitter.removeListener,
    emit: emitter.emit,
    set_active_chain,
    set_accounts: update_accounts,
    get_active_chain() {
      return active_chain_id
    },
    get_accounts() {
      return accounts
    },
    add_chain(chain_id) {
      known_chains.add(chain_id)
    },
    has_chain(chain_id) {
      return known_chains.has(chain_id)
    },
  }
}

// Wrap an EIP-1193 provider (an EIP-6963 announce result,
// window.ethereum, a test mock) into a single Ethernauta
// factory exposing both reader and signer resolvers. The
// wallet picks the RPC for the active chain, so no CHAINS
// list is needed; if the wallet fails to serve a method,
// that surfaces as the wallet's error.
//
//   const provider = create_provider(eip1193)
//   eth_getBalance(addr)(provider.reader({ chain_id }))
//   eth_sendTransaction(tx)(provider.signer({ chain_id }))
export type ProviderResolver = {
  reader: (_input: ReadContext) => ResolvedReader
  signer: (_input: SignContext) => ResolvedSigner
}

export function create_provider(
  _provider: Provider,
): ProviderResolver {
  const http = create_injected_transport(_provider)
  const signer_factory = create_injected_signer(_provider)
  return {
    reader: (_input: ReadContext): ResolvedReader => {
      const context = parse(ReadContextSchema, _input)
      return [[http], context]
    },
    signer: signer_factory,
  }
}
