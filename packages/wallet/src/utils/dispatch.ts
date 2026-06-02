// Wallet-side EIP-1193 request router. The 1193 Provider
// envelope (packages/eip/src/1193/provider.ts) carries no
// dispatch logic; everything routes through this module.
// Methods are partitioned into four strict allowlists; a
// method outside all four is rejected with 4200.

import {
  invalid_params,
  type RequestArguments,
  unsupported_method,
} from "@ethernauta/eip/1193"

// Synchronous reads served from wallet-cached state. No
// RPC, no popup, no chrome.storage.
export const WALLET_STATE_METHODS = new Set<string>([
  "eth_chainId",
  "eth_accounts",
  "net_version",
  "wallet_getCapabilities",
  "wallet_getPermissions",
])

// Pure chain reads. Forwarded to the active chain's RPC.
// EIP-1474 catalog subset that actually gets used.
export const CHAIN_READ_METHODS = new Set<string>([
  "eth_blockNumber",
  "eth_call",
  "eth_getBalance",
  "eth_getCode",
  "eth_getStorageAt",
  "eth_estimateGas",
  "eth_gasPrice",
  "eth_getTransactionReceipt",
  "eth_getTransactionByHash",
  "eth_getTransactionByBlockHashAndIndex",
  "eth_getTransactionByBlockNumberAndIndex",
  "eth_getTransactionCount",
  "eth_getBlockByNumber",
  "eth_getBlockByHash",
  "eth_getBlockTransactionCountByHash",
  "eth_getBlockTransactionCountByNumber",
  "eth_getLogs",
  "eth_getProof",
  "eth_feeHistory",
  "eth_maxPriorityFeePerGas",
  "eth_blobBaseFee",
  "eth_protocolVersion",
  "eth_syncing",
  "net_listening",
  "net_peerCount",
  "web3_clientVersion",
  "web3_sha3",
])

// Methods that require user confirmation. Forwarded to
// the popup via the bridge. `wallet_switchEthereumChain`
// sits here per EIP-3326 §Security Considerations — the
// wallet "should display a confirmation … clearly
// identifying the requester and the chain that will be
// switched to" rather than silently mutating active state.
export const SIGNABLE_METHODS = new Set<string>([
  "eth_requestAccounts",
  "wallet_requestPermissions",
  "eth_sendTransaction",
  "eth_signTransaction",
  "personal_sign",
  "eth_sign",
  "eth_signTypedData_v4",
  "wallet_switchEthereumChain",
  "wallet_sendCalls",
  "wallet_sendSetCodeTransaction",
])

// Wallet-internal reads — answered from extension storage
// (e.g. the EIP-5792 batch registry). No popup, no RPC.
export const WALLET_INTERNAL_METHODS = new Set<string>([
  "wallet_getCallsStatus",
])

// Function-bearing DI contract — kept as an intersection-shaped
// alias because Valibot cannot type per-call argument relations.
export type RouterDeps = Readonly<{
  get_active_chain: () => string
  get_accounts: () => string[]
  get_capabilities: () => unknown
  get_permissions: () => unknown
  rpc_call: (
    _chain_id: string,
    _method: string,
    _params: unknown,
  ) => Promise<unknown>
  forward_to_popup: (
    _args: RequestArguments,
  ) => Promise<unknown>
  read_calls_status: (_id: string) => Promise<unknown>
}>

function chain_id_to_decimal(hex: string): string {
  if (!hex.startsWith("0x"))
    throw invalid_params(`expected 0x-prefixed hex: ${hex}`)
  return BigInt(hex).toString(10)
}

export function create_router(
  deps: RouterDeps,
): (_args: RequestArguments) => Promise<unknown> {
  async function handle_wallet_state(
    args: RequestArguments,
  ): Promise<unknown> {
    switch (args.method) {
      case "eth_chainId":
        return deps.get_active_chain()
      case "eth_accounts":
        return deps.get_accounts()
      case "net_version":
        return chain_id_to_decimal(deps.get_active_chain())
      case "wallet_getCapabilities":
        return deps.get_capabilities()
      case "wallet_getPermissions":
        return deps.get_permissions()
      default:
        throw unsupported_method(args.method)
    }
  }

  async function handle_wallet_internal(
    args: RequestArguments,
  ): Promise<unknown> {
    if (args.method === "wallet_getCallsStatus") {
      const params = args.params as
        | readonly [string]
        | undefined
      const id = params?.[0]
      if (typeof id !== "string")
        throw invalid_params(
          "wallet_getCallsStatus expects [batch_id]",
        )
      return deps.read_calls_status(id)
    }
    throw unsupported_method(args.method)
  }

  return async function handle_request(
    args: RequestArguments,
  ): Promise<unknown> {
    if (WALLET_STATE_METHODS.has(args.method))
      return handle_wallet_state(args)
    if (CHAIN_READ_METHODS.has(args.method))
      return deps.rpc_call(
        deps.get_active_chain(),
        args.method,
        args.params,
      )
    if (SIGNABLE_METHODS.has(args.method))
      return deps.forward_to_popup(args)
    if (WALLET_INTERNAL_METHODS.has(args.method))
      return handle_wallet_internal(args)
    throw unsupported_method(args.method)
  }
}
