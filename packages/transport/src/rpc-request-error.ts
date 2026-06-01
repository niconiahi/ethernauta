// Typed error thrown by `@ethernauta/eth` RPC method bindings when
// the JSON-RPC response carries a `{ error }` payload.
//
// The standard JSON-RPC error shape is `{ code, message, data? }`.
// Existing call sites historically did `throw new Error(error.message)`,
// which preserved the message but dropped `data` — and `data` is where
// reverters put their payload (Solidity `Error(string)`, `Panic(uint256)`,
// or a custom error like EIP-3668's `OffchainLookup`).
//
// `RpcRequestError extends Error`, so any consumer that already
// catches as `Error` and reads `.message` keeps working unchanged.
// Consumers that want the revert bytes do
// `if (e instanceof RpcRequestError) e.data` and parse via the
// schema relevant to their call.

import type { RpcError } from "./json-rpc"

export class RpcRequestError extends Error {
  readonly code: RpcError["code"]
  readonly data: RpcError["data"]
  constructor(_payload: RpcError) {
    super(_payload.message)
    this.name = "RpcRequestError"
    this.code = _payload.code
    this.data = _payload.data
  }
}
