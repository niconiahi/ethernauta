import type {
  ConnectRequest,
  NativeExtensionCloseResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  TransactionRejectedResponse,
} from "../src/utils/event"

type Wallet = {
  connect: () => void
  sign: (
    method: string,
    params: unknown[],
  ) => Promise<string>
}

declare global {
  interface Window {
    wallet: Wallet
  }
}

window.wallet = {
  sign: async (
    method: string,
    params: unknown[] | Record<string, unknown>,
  ): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
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
            event.data.type.startsWith(
              "ETHERNAUTA_RESPONSE",
            ) &&
            event.data.id === id
          ) {
            window.removeEventListener("message", handler)
            if (
              event.data.type ===
              "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
            ) {
              reject(
                new Error("Transaction rejected by user"),
              )
              return
            }
            if (
              event.data.type ===
              "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
            ) {
              reject(new Error("Extension closed"))
              return
            }
            resolve(
              (event.data as SignTransactionResponse)
                .signed_transaction,
            )
          }
        },
      )
      const request: SignTransactionRequest = {
        type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
        id,
        method,
        params,
      }
      window.postMessage(request, window.location.origin)
    })
  },
  connect: () => {
    const request: ConnectRequest = {
      type: "ETHERNAUTA_REQUEST_CONNECT",
      id: crypto.randomUUID(),
    }
    window.postMessage(request, window.location.origin)
  },
}
