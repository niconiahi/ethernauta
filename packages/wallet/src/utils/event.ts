import {
  custom,
  type InferOutput,
  literal,
  number,
  object,
  optional,
  string,
  union,
  unknown,
} from "valibot"

export {
  type FunctionSignature,
  FunctionSignatureSchema,
} from "@ethernauta/transport"

// The wallet's internal message bus speaks pure JSON-RPC 2.0.
// EIP-1193 (the dapp ↔ provider contract) is a JS object API
// that wraps the same call shape; routing it through our bus
// means a 1193 `provider.request({ method, params })` becomes
// a JSON-RPC request on the wire, and a 1193 event
// (`chainChanged`, `accountsChanged`) becomes a JSON-RPC
// notification. The wire shape is therefore identical to
// what we already speak to public RPC nodes via
// `@ethernauta/transport`'s `http()` transport — internal +
// external transport collapse onto one protocol.
//
// We add a single `source: "ethernauta"` marker on every
// envelope. `window.postMessage` is broadcast to every script
// in the page; without the marker, another injected wallet's
// JSON-RPC traffic would be indistinguishable from ours.
// JSON-RPC 2.0 §5 explicitly permits implementations to
// include additional fields, so the marker is spec-compliant.

const SOURCE = "ethernauta"
const SourceSchema = literal(SOURCE)
const VersionSchema = literal("2.0")
const IdSchema = string()
// Matches `RequestArgumentsSchema` in `@ethernauta/eip/1193`
// so a 1193 `request({ method, params })` lifts onto our
// JSON-RPC envelope without coercion. Per JSON-RPC 2.0 §4.2
// params MUST be a structured value (array or object).
export const RpcParamsSchema = optional(
  custom<readonly unknown[] | object>(
    (value) =>
      Array.isArray(value) ||
      (typeof value === "object" && value !== null),
  ),
)
const ParamsSchema = RpcParamsSchema

// Wallet-internal notification method names. EIP-1193 event
// names (`chainChanged`, `accountsChanged`) ride on the same
// envelope unchanged — the page-context provider emits them
// to the dapp under the same name they arrive with. The
// `wallet/*` prefix is reserved for purely-internal signals
// the dapp never sees.
export const WALLET_METHOD = {
  POPUP_READY: "wallet/popup_ready",
} as const

// JSON-RPC 2.0 request — dapp/popup boundary. The two extra
// fields (`to`, `chainId`) are wallet-internal sidecars per
// JSON-RPC §5: `to` carries an optional contract-address
// hint for the sign view's decoder; `chainId` carries the
// requesting page's active chain id for display. Strict
// 1193 clients (MetaMask, Rabby) drop unknown fields.
export const RpcRequestSchema = object({
  source: SourceSchema,
  jsonrpc: VersionSchema,
  id: IdSchema,
  method: string(),
  params: ParamsSchema,
  to: optional(string()),
  chainId: optional(string()),
})
export type RpcRequest = InferOutput<
  typeof RpcRequestSchema
>

const RpcErrorSchema = object({
  code: number(),
  message: string(),
  data: optional(unknown()),
})
export type RpcErrorPayload = InferOutput<
  typeof RpcErrorSchema
>

export const RpcSuccessResponseSchema = object({
  source: SourceSchema,
  jsonrpc: VersionSchema,
  id: IdSchema,
  result: unknown(),
})
export type RpcSuccessResponse = InferOutput<
  typeof RpcSuccessResponseSchema
>

export const RpcErrorResponseSchema = object({
  source: SourceSchema,
  jsonrpc: VersionSchema,
  id: IdSchema,
  error: RpcErrorSchema,
})
export type RpcErrorResponse = InferOutput<
  typeof RpcErrorResponseSchema
>

export const RpcResponseSchema = union([
  RpcSuccessResponseSchema,
  RpcErrorResponseSchema,
])
export type RpcResponse = InferOutput<
  typeof RpcResponseSchema
>

// JSON-RPC 2.0 notification — no `id`, no reply expected.
// Carries EIP-1193 events (chainChanged, accountsChanged)
// outward and wallet-internal one-way signals (popup_ready)
// inward.
export const RpcNotificationSchema = object({
  source: SourceSchema,
  jsonrpc: VersionSchema,
  method: string(),
  params: ParamsSchema,
})
export type RpcNotification = InferOutput<
  typeof RpcNotificationSchema
>

// Top-level discriminator for the postMessage bus. Order
// matters: requests (id + method) must be tried before
// notifications (method, no id required) so a well-formed
// request isn't misclassified as a notification.
export const EthernautaEventSchema = union([
  RpcRequestSchema,
  RpcResponseSchema,
  RpcNotificationSchema,
])
export type EthernautaEvent = InferOutput<
  typeof EthernautaEventSchema
>

// The popup needs to differentiate "is this a wallet request
// I should route to a view" vs "is this a wallet response/
// notification I should ignore". `EthernautaRequestSchema`
// is the popup-side narrowing.
export const EthernautaRequestSchema = RpcRequestSchema
export type EthernautaRequest = RpcRequest

// Construct envelopes without restating the marker/version
// at every call site.
export function make_request(args: {
  id: string
  method: string
  params?: RpcRequest["params"]
  to?: string
  chainId?: string
}): RpcRequest {
  return {
    source: SOURCE,
    jsonrpc: "2.0",
    id: args.id,
    method: args.method,
    params: args.params,
    to: args.to,
    chainId: args.chainId,
  }
}

export function make_success(
  id: string,
  result: unknown,
): RpcSuccessResponse {
  return {
    source: SOURCE,
    jsonrpc: "2.0",
    id,
    result,
  }
}

export function make_error(
  id: string,
  code: number,
  message: string,
  data?: unknown,
): RpcErrorResponse {
  return {
    source: SOURCE,
    jsonrpc: "2.0",
    id,
    error: { code, message, data },
  }
}

export function make_notification(
  method: string,
  params?: RpcNotification["params"],
): RpcNotification {
  return {
    source: SOURCE,
    jsonrpc: "2.0",
    method,
    params,
  }
}
