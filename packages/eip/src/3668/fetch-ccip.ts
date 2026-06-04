// https://eips.ethereum.org/EIPS/eip-3668
//
// Iterate the gateway URLs the contract suggested and return the
// first successful `{ data }` payload. Per the spec:
//
//   - If the URL template contains `{data}`, GET it (the call data
//     is rendered into the URL).
//   - Otherwise, POST `{ data, sender }` as a JSON body to the URL.
//   - 4xx terminates the whole lookup with the failing URL's body
//     used as the error context.
//   - 5xx tries the next URL; if every URL returns 5xx, the lookup
//     fails with an all-5xx error.
//   - 2xx returns the parsed `{ data }` payload.
//
// `fetch` is an optional second argument with a `globalThis.fetch`
// fallback per the project's Phase 0 Q3 decision. Worker / edge
// runtimes that ship a non-global fetch (custom timeouts,
// polyfills) pass their own.

import {
  AddressSchema,
  type Bytes,
  BytesSchema,
} from "@ethernauta/core"
import {
  array,
  type InferOutput,
  object,
  parse,
  string,
} from "valibot"

import { CcipResponseSchema } from "./schemas"
import { substitute_url } from "./substitute-url"

export const FetchCcipArgsSchema = object({
  urls: array(string()),
  sender: AddressSchema,
  call_data: BytesSchema,
})
export type FetchCcipArgs = InferOutput<
  typeof FetchCcipArgsSchema
>

export class CcipFetchError extends Error {
  readonly url: string
  readonly status: number
  readonly body: string
  constructor(
    _message: string,
    _url: string,
    _status: number,
    _body: string,
  ) {
    super(_message)
    this.name = "CcipFetchError"
    this.url = _url
    this.status = _status
    this.body = _body
  }
}

export class CcipAllGatewaysFailedError extends Error {
  readonly attempts: ReadonlyArray<
    readonly [string, number]
  >
  constructor(
    _attempts: ReadonlyArray<readonly [string, number]>,
  ) {
    super(
      `all CCIP gateways returned 5xx (${_attempts.length} attempt(s))`,
    )
    this.name = "CcipAllGatewaysFailedError"
    this.attempts = _attempts
  }
}

export async function fetch_ccip(
  _args: FetchCcipArgs,
  _fetch?: typeof globalThis.fetch,
): Promise<Bytes> {
  const args = parse(FetchCcipArgsSchema, _args)
  const do_fetch = _fetch ?? globalThis.fetch
  if (typeof do_fetch !== "function") {
    throw new Error(
      "fetch_ccip: no fetch available; pass `fetch` explicitly",
    )
  }
  const attempts: Array<readonly [string, number]> = []
  for (const template of args.urls) {
    const url = substitute_url(
      template,
      args.sender,
      args.call_data,
    )
    const has_data_placeholder = template.includes("{data}")
    const response = has_data_placeholder
      ? await do_fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        })
      : await do_fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: args.call_data,
            sender: args.sender.toLowerCase(),
          }),
        })
    if (response.status >= 400 && response.status < 500) {
      const body = await safe_read_text(response)
      throw new CcipFetchError(
        `CCIP gateway returned ${response.status} for ${url}`,
        url,
        response.status,
        body,
      )
    }
    if (response.status >= 500) {
      attempts.push([url, response.status])
      continue
    }
    const json = await response.json()
    const parsed = parse(CcipResponseSchema, json)
    return parsed.data
  }
  throw new CcipAllGatewaysFailedError(attempts)
}

async function safe_read_text(
  _response: Response,
): Promise<string> {
  try {
    return await _response.text()
  } catch {
    return ""
  }
}
