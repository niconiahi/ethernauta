import {
  type Address,
  addressSchema,
  type Bytes,
  bytesSchema,
} from "@ethernauta/core"
import { object, parse, string, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import type { Callable } from "./contract"
import type { Response } from "./json-rpc"
import { create_multicall } from "./multicall"

function fake_transport(
  _capture: (_payload: unknown) => void,
  _result: Bytes,
) {
  return async (_call: unknown): Promise<Response> => {
    _capture(_call)
    return {
      jsonrpc: "2.0" as const,
      id: "1",
      result: _result,
    }
  }
}

function make_callable<T>(
  _to: Address,
  _data: Bytes,
  _decoded: T,
): Callable<T> {
  return {
    chain_id: "eip155:1",
    to: _to,
    data: _data,
    decode: () => _decoded,
  }
}

const EMPTY_BYTES = parse(bytesSchema, "0x")
const ADDRESS_1 = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000001",
)
const ADDRESS_2 = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000002",
)
const SELECTOR_70A08231 = parse(bytesSchema, "0x70a08231")

describe("multicall", () => {
  it("rejects an empty call list", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [fake_transport(() => {}, EMPTY_BYTES)],
      },
    ])
    await expect(multicall([])).rejects.toThrow()
  })

  it("rejects mismatched chain ids", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [fake_transport(() => {}, EMPTY_BYTES)],
      },
      {
        chainId: "eip155:10",
        transports: [fake_transport(() => {}, EMPTY_BYTES)],
      },
    ])
    const a = make_callable(ADDRESS_1, EMPTY_BYTES, "A")
    const b: Callable<string> = {
      chain_id: "eip155:10",
      to: ADDRESS_2,
      data: EMPTY_BYTES,
      decode: () => "B",
    }
    await expect(
      multicall([a, b] as const),
    ).rejects.toThrow(/chain mismatch/)
  })

  it("sends a single eth_call to the canonical Multicall address", async () => {
    let captured: unknown
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [
          fake_transport(
            (p) => {
              captured = p
            },
            parse(
              bytesSchema,
              "0x" +
                "0000000000000000000000000000000000000000000000000000000000000020" +
                "0000000000000000000000000000000000000000000000000000000000000001" +
                "0000000000000000000000000000000000000000000000000000000000000020" +
                "0000000000000000000000000000000000000000000000000000000000000001" +
                "0000000000000000000000000000000000000000000000000000000000000040" +
                "0000000000000000000000000000000000000000000000000000000000000000",
            ),
          ),
        ],
      },
    ])
    const call = make_callable(
      ADDRESS_1,
      SELECTOR_70A08231,
      "decoded",
    )
    const [result] = await multicall([call] as const)
    expect(result).toBe("decoded")
    const [method, [{ to }]] = parse(
      tuple([string(), tuple([object({ to: string() })])]),
      captured,
    )
    expect(method).toBe("eth_call")
    expect(to.toLowerCase()).toBe(
      "0xca11bde05977b3631167028862be2a173976ca11",
    )
  })

  it("returns per-slot Result when allow_failure is true", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [
          fake_transport(
            () => {},
            parse(
              bytesSchema,
              "0x" +
                "0000000000000000000000000000000000000000000000000000000000000020" +
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000040" +
                "00000000000000000000000000000000000000000000000000000000000000a0" +
                "0000000000000000000000000000000000000000000000000000000000000001" +
                "0000000000000000000000000000000000000000000000000000000000000040" +
                "0000000000000000000000000000000000000000000000000000000000000000" +
                "0000000000000000000000000000000000000000000000000000000000000000" +
                "0000000000000000000000000000000000000000000000000000000000000040" +
                "0000000000000000000000000000000000000000000000000000000000000000",
            ),
          ),
        ],
      },
    ])
    const ok = make_callable(ADDRESS_1, EMPTY_BYTES, 42)
    const fail = make_callable(ADDRESS_2, EMPTY_BYTES, 99)
    const [a, b] = await multicall([ok, fail] as const, {
      allow_failure: true,
    })
    expect(a).toEqual({ success: true, value: 42 })
    expect(b).toEqual({ success: false, value: undefined })
  })

  it("throws on revert when allow_failure is unset", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [
          fake_transport(
            () => {},
            parse(
              bytesSchema,
              "0x" +
                "0000000000000000000000000000000000000000000000000000000000000020" +
                "0000000000000000000000000000000000000000000000000000000000000001" +
                "0000000000000000000000000000000000000000000000000000000000000020" +
                "0000000000000000000000000000000000000000000000000000000000000000" +
                "0000000000000000000000000000000000000000000000000000000000000040" +
                "0000000000000000000000000000000000000000000000000000000000000000",
            ),
          ),
        ],
      },
    ])
    const call = make_callable(ADDRESS_1, EMPTY_BYTES, "x")
    await expect(
      multicall([call] as const),
    ).rejects.toThrow(/call #0 reverted/)
  })
})
