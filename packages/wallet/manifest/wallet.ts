import {
  create_envelope,
  ERROR_CODE,
  invalid_params,
  type ProviderInternal,
  type RequestArguments,
} from "@ethernauta/eip/1193"
import { addEthereumChainParametersSchema } from "@ethernauta/eip/3085"
import { announce } from "@ethernauta/eip/6963"
import { http } from "@ethernauta/transport"
import { safeParse } from "valibot"
import icon from "../public/icons/icon-128.png?inline"
import {
  compose_calls_status,
  compose_capabilities,
} from "../src/utils/calls-status"
import {
  to_provider_chain_id,
  CHAINS as WALLET_CHAINS,
} from "../src/utils/chain"
import { create_router } from "../src/utils/dispatch"
import type {
  AddChainApprovedResponse,
  NativeExtensionCloseResponse,
  PersonalSignResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  SignTypedDataResponse,
  TransactionRejectedResponse,
} from "../src/utils/event"

const CHAIN_HEX_LIST = WALLET_CHAINS.map(
  to_provider_chain_id,
)
const known_chains = new Set<string>(CHAIN_HEX_LIST)
let active_chain_id: string = CHAIN_HEX_LIST[0] ?? "0x1"
let accounts: string[] = []

function set_active_chain(chain_id: string): void {
  if (chain_id === active_chain_id) return
  active_chain_id = chain_id
  provider.emit("chainChanged", chain_id)
}

function set_accounts(next: string[]): void {
  const changed =
    next.length !== accounts.length ||
    next.some((a, i) => a !== accounts[i])
  accounts = next
  if (changed) provider.emit("accountsChanged", next)
}

function get_permissions(): Array<{
  parentCapability: string
  caveats: Array<{ type: string; value: unknown }>
}> {
  // https://eips.ethereum.org/EIPS/eip-2255
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

async function rpc_call(
  chain_id_hex: string,
  method: string,
  params: unknown,
): Promise<unknown> {
  const chain_num = Number.parseInt(
    chain_id_hex.slice(2),
    16,
  )
  const chain = WALLET_CHAINS.find(
    (c) => c.id === chain_num,
  )
  if (!chain)
    throw invalid_params(
      `no RPC configured for chain: ${chain_id_hex}`,
    )
  const transport = http(chain.rpc_url)
  const response = await transport([
    method,
    (params ?? []) as unknown[] | { [x: string]: unknown },
  ])
  if ("error" in response) {
    throw {
      code: response.error.code,
      message: response.error.message,
      data: response.error.data,
    }
  }
  return response.result
}

function postmessage_and_wait(
  args: RequestArguments,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID()
    window.addEventListener(
      "message",
      function handler(
        event: MessageEvent<
          | SignTransactionResponse
          | SignTypedDataResponse
          | PersonalSignResponse
          | AddChainApprovedResponse
          | TransactionRejectedResponse
          | NativeExtensionCloseResponse
        >,
      ) {
        if (
          !event.data?.type?.startsWith(
            "ETHERNAUTA_RESPONSE",
          ) ||
          event.data.id !== id
        )
          return
        window.removeEventListener("message", handler)
        if (
          event.data.type ===
          "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
        ) {
          reject({
            code: ERROR_CODE.USER_REJECTED_REQUEST,
            message: "User rejected request",
          })
          return
        }
        if (
          event.data.type ===
          "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
        ) {
          reject({
            code: ERROR_CODE.USER_REJECTED_REQUEST,
            message: "Extension closed",
          })
          return
        }
        if (
          event.data.type ===
            "ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA" ||
          event.data.type ===
            "ETHERNAUTA_RESPONSE_PERSONAL_SIGNED"
        ) {
          resolve(event.data.signature)
          return
        }
        if (
          event.data.type ===
          "ETHERNAUTA_RESPONSE_ADD_CHAIN_APPROVED"
        ) {
          resolve(null)
          return
        }
        const payload = (
          event.data as SignTransactionResponse
        ).signed_transaction
        if (args.method === "eth_requestAccounts") {
          try {
            resolve(JSON.parse(payload))
          } catch {
            resolve(payload)
          }
          return
        }
        resolve(payload)
      },
    )
    const request: SignTransactionRequest = {
      type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
      id,
      method: args.method,
      chainId: active_chain_id,
      params: args.params as unknown[],
    }
    window.postMessage(request, window.location.origin)
  })
}

async function forward_to_popup(
  args: RequestArguments,
): Promise<unknown> {
  // https://eips.ethereum.org/EIPS/eip-2255
  // wallet_requestPermissions is a connect-flow alias —
  // the popup only models eth_requestAccounts, so we
  // translate and synthesize the permission shape.
  if (args.method === "wallet_requestPermissions") {
    const next = await postmessage_and_wait({
      method: "eth_requestAccounts",
    })
    const accounts_next = Array.isArray(next)
      ? (next as string[])
      : []
    set_accounts(accounts_next)
    return get_permissions()
  }
  const result = await postmessage_and_wait(args)
  if (args.method === "eth_requestAccounts") {
    const next = Array.isArray(result)
      ? (result as string[])
      : []
    set_accounts(next)
  }
  if (args.method === "wallet_addEthereumChain") {
    const added = extract_added_chain_id(args.params)
    if (added) known_chains.add(added)
  }
  return result
}

const handle_request = create_router({
  get_active_chain: () => active_chain_id,
  get_accounts: () => accounts,
  has_chain: (id) => known_chains.has(id),
  set_active_chain,
  get_capabilities: () => compose_capabilities(),
  get_permissions,
  rpc_call,
  forward_to_popup,
  read_calls_status: (id) => compose_calls_status(id),
})

const provider: ProviderInternal = create_envelope({
  request: handle_request,
})

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (
    event.data?.type ===
    "ETHERNAUTA_NOTIFICATION_CHAIN_SELECTED"
  ) {
    const chain_id = event.data.chainId as string
    if (!known_chains.has(chain_id)) return
    set_active_chain(chain_id)
    return
  }
  if (
    event.data?.type ===
    "ETHERNAUTA_NOTIFICATION_ACCOUNTS_CHANGED"
  ) {
    const next = event.data.accounts as string[]
    set_accounts(next)
    return
  }
})

announce({
  info: {
    uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Ethernauta",
    icon,
    rdns: "com.ethernauta.wallet",
  },
  provider,
})
