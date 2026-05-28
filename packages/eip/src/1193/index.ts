// https://eips.ethereum.org/EIPS/eip-1193

export {
  chain_disconnected,
  disconnected,
  ERROR_CODE,
  type ErrorCode,
  invalid_params,
  type ProviderRpcError,
  provider_error,
  unauthorized,
  unrecognized_chain,
  unsupported_method,
  user_rejected,
} from "./error"
export {
  create_emitter,
  type Emitter,
  type EthSubscription,
  type EventMap,
  type EventName,
  type ProviderConnectInfo,
  type ProviderMessage,
} from "./events"
export {
  type CreateProviderOptions,
  create_provider,
  type Provider,
  type RequestArguments,
  RequestArgumentsSchema,
  type SignableHandler,
} from "./provider"
export { watch_accounts, watch_chain } from "./watch"
