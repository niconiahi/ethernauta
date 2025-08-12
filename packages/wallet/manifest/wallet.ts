import type {
  ConnectRequest,
  SignTransactionRequest,
  SignTransactionResponse,
} from "../src/utils/event"

type Wallet = {
  connect: () => Promise<void>
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
    return new Promise<string>((resolve) => {
      const id = crypto.randomUUID()
      window.addEventListener(
        "message",
        function handler(
          event: MessageEvent<SignTransactionResponse>,
        ) {
          if (
            event.data.type.startsWith(
              "ETHERNAUTA_RESPONSE",
            ) &&
            event.data.id === id
          ) {
            window.removeEventListener("message", handler)
            resolve(event.data.signed_transaction)
          }
        },
      )
      const request: SignTransactionRequest = {
        type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
        id,
        method,
        params,
      }
      window.postMessage(request, "*")
    })
  },
  connect: async (): Promise<void> => {
    return new Promise<void>(() => {
      const id = crypto.randomUUID()
      const request: ConnectRequest = {
        type: "ETHERNAUTA_REQUEST_CONNECT",
        id,
      }
      window.postMessage(request, "*")
    })
  },
}
