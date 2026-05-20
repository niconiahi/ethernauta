// https://eips.ethereum.org/EIPS/eip-1193#errors
// https://eips.ethereum.org/EIPS/eip-1474#error-codes

export const ERROR_CODE = {
  USER_REJECTED_REQUEST: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
  UNRECOGNIZED_CHAIN: 4902,
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const

export type ErrorCode =
  (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export interface ProviderRpcError extends Error {
  code: number
  data?: unknown
}

export function provider_error(
  code: number,
  message: string,
  data?: unknown,
): ProviderRpcError {
  const error = new Error(message) as ProviderRpcError
  error.code = code
  if (data !== undefined) error.data = data
  return error
}

export function user_rejected(
  message = "User rejected request",
): ProviderRpcError {
  return provider_error(
    ERROR_CODE.USER_REJECTED_REQUEST,
    message,
  )
}

export function unauthorized(
  message = "Unauthorized",
): ProviderRpcError {
  return provider_error(ERROR_CODE.UNAUTHORIZED, message)
}

export function unsupported_method(
  method: string,
): ProviderRpcError {
  return provider_error(
    ERROR_CODE.UNSUPPORTED_METHOD,
    `method not supported: ${method}`,
  )
}

export function disconnected(
  message = "Provider disconnected",
): ProviderRpcError {
  return provider_error(ERROR_CODE.DISCONNECTED, message)
}

export function chain_disconnected(
  message = "Chain disconnected",
): ProviderRpcError {
  return provider_error(
    ERROR_CODE.CHAIN_DISCONNECTED,
    message,
  )
}

export function unrecognized_chain(
  chain_id: string,
): ProviderRpcError {
  return provider_error(
    ERROR_CODE.UNRECOGNIZED_CHAIN,
    `unrecognized chain id: ${chain_id}`,
    { chainId: chain_id },
  )
}

export function invalid_params(
  message: string,
): ProviderRpcError {
  return provider_error(ERROR_CODE.INVALID_PARAMS, message)
}
