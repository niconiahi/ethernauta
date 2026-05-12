import {
  create_provider,
  ERROR_CODE,
  type Provider,
} from "@ethernauta/eip/1193"
import { announce } from "@ethernauta/eip/6963"
import type {
  NativeExtensionCloseResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  TransactionRejectedResponse,
} from "../src/utils/event"
import icon from "../public/icons/icon-128.png?inline"

function create_signer() {
  return (
    method: string,
    params: unknown,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      window.addEventListener(
        "message",
        function handler(
          event: MessageEvent<
            | SignTransactionResponse
            | TransactionRejectedResponse
            | NativeExtensionCloseResponse
          >,
        ) {
          if (
            !event.data.type.startsWith(
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
          resolve(
            (event.data as SignTransactionResponse)
              .signed_transaction,
          )
        },
      )
      const request: SignTransactionRequest = {
        type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
        id,
        method,
        params: params as unknown[],
      }
      window.postMessage(request, window.location.origin)
    })
  }
}

const provider = create_provider({
  chains: [{ chainId: "0xaa36a7", transports: [] }],
  signer: create_signer(),
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

declare global {
  interface Window {
    ethereum: Provider
  }
}

window.ethereum = provider
