type SignTransactionRequest = {
  type: "CRYPTOMAN_SIGN_TRANSACTION"
  id: string
  method: string
  params: unknown[]
}

type SignTransactionResponse = {
  id: string
  error?: string
  signature?: string
}

type ConnectRequest = {
  type: "CRYPTOMAN_CONNECT"
  id: string
}

type ConnectResponse = {
  id: string
  error?: string
}

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
    return new Promise<string>((resolve, reject) => {
      const id = crypto.randomUUID()
      window.addEventListener(
        "message",
        function handler(
          event: MessageEvent<SignTransactionResponse>,
        ) {
          if (event.data.id === id) {
            window.removeEventListener("message", handler)
            if (event.data.error) {
              reject(new Error(event.data.error))
            }
            if (event.data.signature) {
              resolve(event.data.signature)
            }
          }
        },
      )
      const request: SignTransactionRequest = {
        type: "CRYPTOMAN_SIGN_TRANSACTION",
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
        function handler(
          event: MessageEvent<ConnectResponse>,
        ) {
          if (event.data.id === id) {
            window.removeEventListener("message", handler)
            if (event.data.error) {
              reject(new Error(event.data.error))
            }
            resolve()
          }
        },
      )
      const request: ConnectRequest = {
        type: "CRYPTOMAN_CONNECT",
        id,
      }
      window.postMessage(request, "*")
    })
  },
}
