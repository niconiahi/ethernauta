export type Signer = (
  method: string,
  params: unknown,
) => Promise<string>

export type Signable<T> = (_signer: Signer) => Promise<T>

const ERROR_CODE = {
  USER_REJECTED_REQUEST: 4001,
} as const

type SignTransactionRequest = {
  id: string
  type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION"
  method: string
  chainId: string
  params?: unknown[] | Record<string, unknown>
}

type SignTransactionResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"
  signed_transaction: string
}

type TransactionRejectedResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
}

type NativeExtensionCloseResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
}

export function create_signer(
  chains: Array<{ chainId: string }>,
): (chainId: string) => Signer {
  return (chainId: string): Signer => {
    const chain = chains.find((c) => c.chainId === chainId)
    if (!chain)
      throw new Error(`no chain configured for: ${chainId}`)
    return (method, params) =>
      new Promise((resolve, reject) => {
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
          chainId,
          params: params as unknown[],
        }
        window.postMessage(request, window.location.origin)
      })
  }
}
