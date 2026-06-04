// https://eips.ethereum.org/EIPS/eip-3668
//
// `eth_call_ccip` — `eth_call` with automatic off-chain resolution.
//
// Wraps a standard `eth_call` invocation; if the call reverts with
// the `OffchainLookup` custom error, fetches the off-chain payload
// from one of the contract-supplied gateway URLs and re-issues the
// call with the gateway's response folded back in via the callback
// selector. Recurses if the second call also reverts with
// `OffchainLookup`, up to `max_redirects` (default 4) per the spec.
//
// `to` and `input` are kept as a small named struct rather than
// mirroring `@ethernauta/eth`'s full `EthCallParameters` because:
//   - EIPs cannot import from `@ethernauta/eth` (skill rule).
//   - CCIP-Read does not interact with `state` overrides or with
//     block-tag flexibility — every recursive call targets the same
//     latest-block snapshot the original call did. Consumers that
//     need block pinning compose `eth_call` directly.

import {
  AddressSchema,
  type Bytes,
  BytesSchema,
} from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
  RpcRequestError,
} from "@ethernauta/transport"
import {
  type InferOutput,
  number,
  object,
  optional,
  parse,
  safeParse,
} from "valibot"

import { build_callback_calldata } from "./build-callback-calldata"
import { CcipLookupError } from "./errors"
import { fetch_ccip } from "./fetch-ccip"
import { parse_offchain_lookup_revert } from "./parse-offchain-lookup-revert"
import type { OffchainLookupError } from "./schemas"

export const EthCallCcipParametersSchema = object({
  to: AddressSchema,
  input: BytesSchema,
})
export type EthCallCcipParameters = InferOutput<
  typeof EthCallCcipParametersSchema
>

export const EthCallCcipOptionsSchema = object({
  max_redirects: optional(number(), 4),
})
export type EthCallCcipOptions = InferOutput<
  typeof EthCallCcipOptionsSchema
>

export function eth_call_ccip(
  _parameters: EthCallCcipParameters,
  _options?: EthCallCcipOptions,
  _fetch?: typeof globalThis.fetch,
): Readable<Bytes> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const parameters = parse(
      EthCallCcipParametersSchema,
      _parameters,
    )
    const options = parse(
      EthCallCcipOptionsSchema,
      _options ?? {},
    )
    let to = parameters.to
    let input = parameters.input
    let attempts_left = options.max_redirects
    while (true) {
      const call = parse(CallSchema, [
        "eth_call",
        [{ to, input }, "latest"],
      ])
      const response = await dispatcher(call)
      if (!("error" in response)) {
        return parse(BytesSchema, response.result)
      }
      const lookup =
        typeof response.error.data === "string"
          ? recognise_offchain_lookup(response.error.data)
          : null
      if (lookup === null) {
        throw new RpcRequestError(response.error)
      }
      if (attempts_left === 0) {
        throw new CcipLookupError(
          `CCIP-Read exhausted ${options.max_redirects} redirect(s)`,
          "max-redirects",
          lookup,
        )
      }
      const response_data = await fetch_ccip(
        {
          urls: lookup.urls,
          sender: lookup.sender,
          call_data: lookup.callData,
        },
        _fetch,
      )
      input = build_callback_calldata(
        lookup.callbackFunction,
        response_data,
        lookup.extraData,
      )
      to = lookup.sender
      attempts_left -= 1
    }
  }
}

function recognise_offchain_lookup(
  _error_data: string,
): OffchainLookupError | null {
  const result = safeParse(BytesSchema, _error_data)
  if (!result.success) return null
  return parse_offchain_lookup_revert(result.output)
}
