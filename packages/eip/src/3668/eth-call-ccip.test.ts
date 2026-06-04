import {
  address,
  array,
  bytes,
  bytes4,
  string_,
  tuple,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes4Schema,
  BytesSchema,
} from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { RpcRequestError } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"

import { CcipLookupError } from "./errors"
import { eth_call_ccip } from "./eth-call-ccip"

const CONTRACT = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const CALLBACK_TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const INITIAL_INPUT = parse(BytesSchema, "0xdeadbeef")
const FINAL_RESULT = parse(BytesSchema, "0xabcd")
const GATEWAY_PAYLOAD = parse(BytesSchema, "0xfeed")
const CALLBACK_SELECTOR = parse(Bytes4Schema, "0xf4d4d2f8")
const EXTRA_DATA = parse(BytesSchema, "0xcafe")
const ORIGINAL_CALLDATA = parse(BytesSchema, "0xbeef")

const testing_reader = create_testing_reader()

const lookup_codec = tuple({
  sender: address(),
  urls: array(string_()),
  callData: bytes(),
  callbackFunction: bytes4(),
  extraData: bytes(),
})

function build_offchain_lookup_data(
  _urls: string[],
): `0x${string}` {
  const encoded = lookup_codec.encode({
    sender: CALLBACK_TARGET,
    urls: _urls,
    callData: ORIGINAL_CALLDATA,
    callbackFunction: CALLBACK_SELECTOR,
    extraData: EXTRA_DATA,
  })
  const out = new Uint8Array(4 + encoded.length)
  out[0] = 0x55
  out[1] = 0x6f
  out[2] = 0x18
  out[3] = 0x30
  out.set(encoded, 4)
  return bytes_to_hex(out)
}

function offchain_lookup_response(
  _id: string,
  _urls: string[],
): Response {
  return {
    id: _id,
    jsonrpc: "2.0",
    error: {
      code: 3,
      message: "execution reverted",
      data: build_offchain_lookup_data(_urls),
    },
  }
}

function ok_response(
  _id: string,
  _result: string,
): Response {
  return { id: _id, jsonrpc: "2.0", result: _result }
}

function error_response(
  _id: string,
  _code: number,
  _message: string,
  _data: string,
): Response {
  return {
    id: _id,
    jsonrpc: "2.0",
    error: { code: _code, message: _message, data: _data },
  }
}

describe("eth-call-ccip.ts", () => {
  it("returns the eth_call result directly when there is no revert", async () => {
    const transport = vi.fn(async (_call: Call) =>
      ok_response("1", FINAL_RESULT),
    )
    const fetch_mock = vi.fn()
    const result = await eth_call_ccip(
      { to: CONTRACT, input: INITIAL_INPUT },
      undefined,
      fetch_mock,
    )(testing_reader(transport))
    expect(result).toBe(FINAL_RESULT)
    expect(transport).toHaveBeenCalledOnce()
    expect(fetch_mock).not.toHaveBeenCalled()
  })

  it("resolves an OffchainLookup revert in one hop", async () => {
    const transport = vi
      .fn<(_call: Call) => Promise<Response>>()
      .mockResolvedValueOnce(
        offchain_lookup_response("1", [
          "https://gw.example.com/{data}",
        ]),
      )
      .mockResolvedValueOnce(ok_response("2", FINAL_RESULT))
    const fetch_mock = vi.fn(
      async () =>
        new globalThis.Response(
          JSON.stringify({ data: GATEWAY_PAYLOAD }),
          { status: 200 },
        ),
    )
    const result = await eth_call_ccip(
      { to: CONTRACT, input: INITIAL_INPUT },
      undefined,
      fetch_mock,
    )(testing_reader(transport))
    expect(result).toBe(FINAL_RESULT)
    expect(transport).toHaveBeenCalledTimes(2)
    expect(fetch_mock).toHaveBeenCalledOnce()
    // Second eth_call goes to the OffchainLookup sender, not the
    // original contract.
    const second_call_args = transport.mock.calls[1]
    if (second_call_args === undefined)
      throw new Error("no second call")
    const second_call = second_call_args[0]
    expect(second_call[0]).toBe("eth_call")
    const params = second_call[1]
    if (!Array.isArray(params))
      throw new Error("expected array params")
    const first_param = params[0]
    if (
      first_param === null ||
      typeof first_param !== "object"
    )
      throw new Error("expected tx object")
    const to_field =
      "to" in first_param ? first_param.to : null
    expect(to_field).toBe(CALLBACK_TARGET)
  })

  it("rethrows non-OffchainLookup reverts via the typed rpc error", async () => {
    const transport = vi.fn(async (_call: Call) =>
      error_response(
        "1",
        3,
        "execution reverted",
        "0xdeadbeef",
      ),
    )
    const fetch_mock = vi.fn()
    const error = await eth_call_ccip(
      { to: CONTRACT, input: INITIAL_INPUT },
      undefined,
      fetch_mock,
    )(testing_reader(transport)).catch((e) => e)
    expect(error).toBeInstanceOf(RpcRequestError)
    expect(transport).toHaveBeenCalledOnce()
    expect(fetch_mock).not.toHaveBeenCalled()
  })

  it("throws CcipLookupError when max_redirects is exhausted", async () => {
    const transport = vi.fn(async (_call: Call) =>
      offchain_lookup_response("1", [
        "https://gw.example.com/{data}",
      ]),
    )
    const fetch_mock = vi.fn(
      async () =>
        new globalThis.Response(
          JSON.stringify({ data: GATEWAY_PAYLOAD }),
          { status: 200 },
        ),
    )
    const error = await eth_call_ccip(
      { to: CONTRACT, input: INITIAL_INPUT },
      { max_redirects: 2 },
      fetch_mock,
    )(testing_reader(transport)).catch((e) => e)
    expect(error).toBeInstanceOf(CcipLookupError)
    if (error instanceof CcipLookupError) {
      expect(error.reason).toBe("max-redirects")
    }
    // initial + 2 redirects = 3 eth_calls before exhaustion on the 4th
    expect(transport).toHaveBeenCalledTimes(3)
  })

  it("uses the default max_redirects of 4 when options are omitted", async () => {
    const transport = vi.fn(async (_call: Call) =>
      offchain_lookup_response("1", [
        "https://gw.example.com/{data}",
      ]),
    )
    const fetch_mock = vi.fn(
      async () =>
        new globalThis.Response(
          JSON.stringify({ data: GATEWAY_PAYLOAD }),
          { status: 200 },
        ),
    )
    const error = await eth_call_ccip(
      { to: CONTRACT, input: INITIAL_INPUT },
      undefined,
      fetch_mock,
    )(testing_reader(transport)).catch((e) => e)
    expect(error).toBeInstanceOf(CcipLookupError)
    // initial + 4 redirects = 5 eth_calls before the 5th throws
    expect(transport).toHaveBeenCalledTimes(5)
  })
})
