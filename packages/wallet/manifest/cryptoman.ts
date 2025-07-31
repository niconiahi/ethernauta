import type {
  ConnectRequest,
  SignTransactionRequest,
  SignTransactionResponse,
} from "../src/utils/event"

type Cryptoman = {
  connect: () => Promise<void>
  sign: (
    method: string,
    params: unknown[],
  ) => Promise<string>
}

declare global {
  interface Window {
    cryptoman: Cryptoman
  }
}

window.cryptoman = {
  sign: async (
    method: string,
    params: unknown[],
  ): Promise<string> => {
    return new Promise<string>((resolve) => {
      const id = crypto.randomUUID()
      window.addEventListener(
        "message",
        function handler(
          event: MessageEvent<SignTransactionResponse>,
        ) {
          if (event.data.id === id) {
            window.removeEventListener("message", handler)
            resolve(event.data.signed_transaction)
          }
        },
      )
      const request: SignTransactionRequest = {
        type: "CRYPTOMAN_REQUEST_SIGN_TRANSACTION",
        id,
        method,
        params,
      }
      window.postMessage(request, "*")
    })
  },
  connect: async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const id = crypto.randomUUID()
      window.addEventListener(
        "message",
        function handler(event: MessageEvent<any>) {},
      )
      const request: ConnectRequest = {
        type: "CRYPTOMAN_REQUEST_CONNECT",
        id,
      }
      window.postMessage(request, "*")
    })
  },
}
