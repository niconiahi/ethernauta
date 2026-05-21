import {
  create_provider,
  ERROR_CODE,
  type ProviderInternal,
  type RequestArguments,
} from "@ethernauta/eip/1193"
import { announce } from "@ethernauta/eip/6963"
import icon from "../public/icons/icon-128.png?inline"
import {
  CHAINS as WALLET_CHAINS,
  to_provider_chain_id,
} from "../src/utils/chain"
import type {
  AddChainApprovedResponse,
  NativeExtensionCloseResponse,
  PersonalSignResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  SignTypedDataResponse,
  TransactionRejectedResponse,
} from "../src/utils/event"

const CHAINS = WALLET_CHAINS.map(to_provider_chain_id)

function on_signable_request(
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
      chainId: provider.get_active_chain(),
      params: args.params as unknown[],
    }
    window.postMessage(request, window.location.origin)
  })
}

const provider: ProviderInternal = create_provider({
  chains: CHAINS,
  on_signable_request,
})

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (
    event.data?.type ===
    "ETHERNAUTA_NOTIFICATION_CHAIN_SELECTED"
  ) {
    const chain_id = event.data.chainId as string
    if (!provider.has_chain(chain_id)) return
    provider.set_active_chain(chain_id)
    return
  }
  if (
    event.data?.type ===
    "ETHERNAUTA_NOTIFICATION_ACCOUNTS_CHANGED"
  ) {
    const accounts = event.data.accounts as string[]
    provider.set_accounts(accounts)
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
