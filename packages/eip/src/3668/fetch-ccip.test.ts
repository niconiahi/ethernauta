import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"

import {
  CcipAllGatewaysFailedError,
  CcipFetchError,
  fetch_ccip,
} from "./fetch-ccip"

const SENDER_CHECKSUM = parse(
  AddressSchema,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
)
const CALL_DATA = parse(BytesSchema, "0xdeadbeefcafe")
const RESPONSE_DATA = parse(BytesSchema, "0xfeedfacebabe")

function ok_json(_body: unknown): Response {
  return new Response(JSON.stringify(_body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function status_only(_status: number, _body = ""): Response {
  return new Response(_body, { status: _status })
}

describe("fetch-ccip.ts", () => {
  it("GETs when the URL template contains {data}", async () => {
    const fetch_mock = vi.fn(
      async (_url: string | URL, _init?: RequestInit) =>
        ok_json({ data: RESPONSE_DATA }),
    )
    const result = await fetch_ccip(
      {
        urls: ["https://gw.example.com/{sender}/{data}"],
        sender: SENDER_CHECKSUM,
        call_data: CALL_DATA,
      },
      fetch_mock,
    )
    expect(result).toBe(RESPONSE_DATA)
    expect(fetch_mock).toHaveBeenCalledOnce()
    const [url, init] = fetch_mock.mock.calls[0]
    expect(String(url)).toBe(
      `https://gw.example.com/${SENDER_CHECKSUM.toLowerCase()}/${CALL_DATA}`,
    )
    expect(init?.method).toBe("GET")
  })

  it("POSTs JSON when the URL template has no {data}", async () => {
    const fetch_mock = vi.fn(
      async (_url: string | URL, _init?: RequestInit) =>
        ok_json({ data: RESPONSE_DATA }),
    )
    const result = await fetch_ccip(
      {
        urls: ["https://gw.example.com/lookup"],
        sender: SENDER_CHECKSUM,
        call_data: CALL_DATA,
      },
      fetch_mock,
    )
    expect(result).toBe(RESPONSE_DATA)
    const [url, init] = fetch_mock.mock.calls[0]
    expect(String(url)).toBe("https://gw.example.com/lookup")
    expect(init?.method).toBe("POST")
    const body = JSON.parse(String(init?.body))
    expect(body.data).toBe(CALL_DATA)
    expect(body.sender).toBe(SENDER_CHECKSUM.toLowerCase())
  })

  it("aborts the whole lookup on 4xx with CcipFetchError", async () => {
    const fetch_mock = vi.fn(
      async () => status_only(404, "not found"),
    )
    await expect(
      fetch_ccip(
        {
          urls: [
            "https://gw.a.example.com/{data}",
            "https://gw.b.example.com/{data}",
          ],
          sender: SENDER_CHECKSUM,
          call_data: CALL_DATA,
        },
        fetch_mock,
      ),
    ).rejects.toBeInstanceOf(CcipFetchError)
    expect(fetch_mock).toHaveBeenCalledOnce()
  })

  it("tries the next URL on 5xx and returns the first 2xx", async () => {
    const fetch_mock = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(status_only(503, "down"))
      .mockResolvedValueOnce(ok_json({ data: RESPONSE_DATA }))
    const result = await fetch_ccip(
      {
        urls: [
          "https://gw.a.example.com/{data}",
          "https://gw.b.example.com/{data}",
        ],
        sender: SENDER_CHECKSUM,
        call_data: CALL_DATA,
      },
      fetch_mock,
    )
    expect(result).toBe(RESPONSE_DATA)
    expect(fetch_mock).toHaveBeenCalledTimes(2)
  })

  it("throws CcipAllGatewaysFailedError when every URL returns 5xx", async () => {
    const fetch_mock = vi.fn(async () => status_only(502))
    const error = await fetch_ccip(
      {
        urls: [
          "https://gw.a.example.com/{data}",
          "https://gw.b.example.com/{data}",
        ],
        sender: SENDER_CHECKSUM,
        call_data: CALL_DATA,
      },
      fetch_mock,
    ).catch((e) => e)
    expect(error).toBeInstanceOf(CcipAllGatewaysFailedError)
    if (error instanceof CcipAllGatewaysFailedError) {
      expect(error.attempts).toHaveLength(2)
      expect(error.attempts[0][1]).toBe(502)
    }
    expect(fetch_mock).toHaveBeenCalledTimes(2)
  })

  it("rejects malformed gateway responses (missing data field)", async () => {
    const fetch_mock = vi.fn(async () => ok_json({ foo: 1 }))
    await expect(
      fetch_ccip(
        {
          urls: ["https://gw.example.com/{data}"],
          sender: SENDER_CHECKSUM,
          call_data: CALL_DATA,
        },
        fetch_mock,
      ),
    ).rejects.toThrow()
  })
})
