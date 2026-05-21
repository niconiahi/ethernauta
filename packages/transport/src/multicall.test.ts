import { describe, expect, it } from "vitest"

import type { Callable } from "./contract"
import type { Response } from "./json-rpc"
import { create_multicall } from "./multicall"

function fake_transport(
  _capture: (_payload: unknown) => void,
  _result: `0x${string}`,
) {
  return async (_call: unknown): Promise<Response> => {
    _capture(_call)
    return {
      jsonrpc: "2.0",
      id: "1",
      result: _result,
    } as Response
  }
}

function make_callable<T>(
  _to: `0x${string}`,
  _data: `0x${string}`,
  _decoded: T,
): Callable<T> {
  return {
    chain_id: "eip155:1",
    to: _to,
    data: _data,
    decode: () => _decoded,
  }
}

describe("multicall", () => {
  it("rejects an empty call list", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [
          fake_transport(() => {}, "0x") as never,
        ],
      },
    ])
    await expect(multicall([] as never)).rejects.toThrow(
      /at least one call/,
    )
  })

  it("rejects mismatched chain ids", async () => {
    const multicall = create_multicall([
      {
        chainId: "eip155:1",
        transports: [
          fake_transport(() => {}, "0x") as never,
        ],
      },
      {
        chainId: "eip155:10",
        transports: [
          fake_transport(() => {}, "0x") as never,
        ],
      },
    ])
    const a = make_callable(
      "0x0000000000000000000000000000000000000001",
      "0x",
      "A",
    )
    const b: Callable<string> = {
      chain_id: "eip155:10",
      to: "0x0000000000000000000000000000000000000002",
      data: "0x",
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
            ("0x" +
              "0000000000000000000000000000000000000000000000000000000000000020" +
              "0000000000000000000000000000000000000000000000000000000000000001" +
              "0000000000000000000000000000000000000000000000000000000000000020" +
              "0000000000000000000000000000000000000000000000000000000000000001" +
              "0000000000000000000000000000000000000000000000000000000000000040" +
              "0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
          ) as never,
        ],
      },
    ])
    const call = make_callable(
      "0x0000000000000000000000000000000000000001",
      "0x70a08231",
      "decoded",
    )
    const [result] = await multicall([call] as const)
    expect(result).toBe("decoded")
    const [method, [{ to }]] = captured as [
      string,
      [{ to: string }],
    ]
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
            ("0x" +
              "0000000000000000000000000000000000000000000000000000000000000020" +
              "0000000000000000000000000000000000000000000000000000000000000002" +
              "0000000000000000000000000000000000000000000000000000000000000040" +
              "00000000000000000000000000000000000000000000000000000000000000a0" +
              "0000000000000000000000000000000000000000000000000000000000000001" +
              "0000000000000000000000000000000000000000000000000000000000000040" +
              "0000000000000000000000000000000000000000000000000000000000000000" +
              "0000000000000000000000000000000000000000000000000000000000000000" +
              "0000000000000000000000000000000000000000000000000000000000000040" +
              "0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
          ) as never,
        ],
      },
    ])
    const ok = make_callable(
      "0x0000000000000000000000000000000000000001",
      "0x",
      42,
    )
    const fail = make_callable(
      "0x0000000000000000000000000000000000000002",
      "0x",
      99,
    )
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
            ("0x" +
              "0000000000000000000000000000000000000000000000000000000000000020" +
              "0000000000000000000000000000000000000000000000000000000000000001" +
              "0000000000000000000000000000000000000000000000000000000000000020" +
              "0000000000000000000000000000000000000000000000000000000000000000" +
              "0000000000000000000000000000000000000000000000000000000000000040" +
              "0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
          ) as never,
        ],
      },
    ])
    const call = make_callable(
      "0x0000000000000000000000000000000000000001",
      "0x",
      "x",
    )
    await expect(
      multicall([call] as const),
    ).rejects.toThrow(/call #0 reverted/)
  })
})
