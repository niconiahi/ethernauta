import {
  ERROR_CODE,
  type RequestArguments,
} from "@ethernauta/eip/1193"
import { describe, expect, it, vi } from "vitest"
import {
  CHAIN_READ_METHODS,
  create_router,
  type RouterDeps,
  SIGNABLE_METHODS,
  WALLET_INTERNAL_METHODS,
  WALLET_STATE_METHODS,
} from "./dispatch"

function make_deps(
  overrides: Partial<RouterDeps> = {},
): RouterDeps {
  return {
    get_active_chain: () => "0x1",
    get_accounts: () => [],
    has_chain: () => true,
    set_active_chain: () => {},
    get_capabilities: () => ({}),
    get_permissions: () => [],
    rpc_call: vi.fn(async () => "0xdeadbeef"),
    forward_to_popup: vi.fn(async () => "0xsigned"),
    read_calls_status: vi.fn(async () => ({
      version: "2.0.0",
      id: "0xabc",
    })),
    ...overrides,
  }
}

describe("create_router — wallet state", () => {
  it("answers eth_chainId from get_active_chain", async () => {
    const deps = make_deps({
      get_active_chain: () => "0xaa36a7",
    })
    const handle = create_router(deps)
    expect(await handle({ method: "eth_chainId" })).toBe(
      "0xaa36a7",
    )
  })

  it("answers net_version as decimal of active chain", async () => {
    const deps = make_deps({
      get_active_chain: () => "0xaa36a7",
    })
    const handle = create_router(deps)
    expect(await handle({ method: "net_version" })).toBe(
      "11155111",
    )
  })

  it("answers eth_accounts from get_accounts", async () => {
    const deps = make_deps({
      get_accounts: () => ["0xabc"],
    })
    const handle = create_router(deps)
    expect(
      await handle({ method: "eth_accounts" }),
    ).toEqual(["0xabc"])
  })

  it("answers wallet_getCapabilities from get_capabilities", async () => {
    const caps = {
      "0x1": { atomic: { status: "unsupported" } },
    }
    const deps = make_deps({ get_capabilities: () => caps })
    const handle = create_router(deps)
    expect(
      await handle({ method: "wallet_getCapabilities" }),
    ).toBe(caps)
  })

  it("switches the active chain when known", async () => {
    const set = vi.fn()
    const deps = make_deps({
      has_chain: (id) => id === "0xaa36a7",
      set_active_chain: set,
    })
    const handle = create_router(deps)
    const result = await handle({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    })
    expect(result).toBeNull()
    expect(set).toHaveBeenCalledWith("0xaa36a7")
  })

  it("throws 4902 when switching to an unknown chain", async () => {
    const deps = make_deps({ has_chain: () => false })
    const handle = create_router(deps)
    await expect(
      handle({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x999" }],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNRECOGNIZED_CHAIN,
    })
  })

  it("throws -32602 on malformed switch params", async () => {
    const deps = make_deps()
    const handle = create_router(deps)
    await expect(
      handle({
        method: "wallet_switchEthereumChain",
        params: [],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.INVALID_PARAMS,
    })
  })
})

describe("create_router — chain reads", () => {
  it("routes eth_blockNumber to rpc_call with active chain", async () => {
    const rpc = vi.fn(async () => "0x100")
    const deps = make_deps({
      get_active_chain: () => "0x1",
      rpc_call: rpc,
    })
    const handle = create_router(deps)
    const result = await handle({
      method: "eth_blockNumber",
      params: [],
    })
    expect(result).toBe("0x100")
    expect(rpc).toHaveBeenCalledWith(
      "0x1",
      "eth_blockNumber",
      [],
    )
  })

  it("routes eth_call to rpc_call", async () => {
    const rpc = vi.fn(async () => "0x42")
    const deps = make_deps({ rpc_call: rpc })
    const handle = create_router(deps)
    await handle({
      method: "eth_call",
      params: [{ to: "0xabc", data: "0x" }, "latest"],
    })
    expect(rpc).toHaveBeenCalledWith("0x1", "eth_call", [
      { to: "0xabc", data: "0x" },
      "latest",
    ])
  })

  it("never forwards a chain-read to the popup", async () => {
    const fwd = vi.fn()
    const deps = make_deps({ forward_to_popup: fwd })
    const handle = create_router(deps)
    await handle({ method: "eth_getBalance", params: [] })
    expect(fwd).not.toHaveBeenCalled()
  })
})

describe("create_router — signables", () => {
  it("forwards eth_sendTransaction to the popup", async () => {
    const fwd = vi.fn(async () => "0xsigned")
    const deps = make_deps({ forward_to_popup: fwd })
    const handle = create_router(deps)
    const args: RequestArguments = {
      method: "eth_sendTransaction",
      params: [{ to: "0xabc", value: "0x1" }],
    }
    expect(await handle(args)).toBe("0xsigned")
    expect(fwd).toHaveBeenCalledWith(args)
  })

  it("forwards wallet_sendCalls to the popup (no reject)", async () => {
    const fwd = vi.fn(async () => ({ id: "0xbatch" }))
    const deps = make_deps({ forward_to_popup: fwd })
    const handle = create_router(deps)
    const result = await handle({
      method: "wallet_sendCalls",
      params: [{ version: "2.0.0", calls: [] }],
    })
    expect(result).toEqual({ id: "0xbatch" })
    expect(fwd).toHaveBeenCalled()
  })

  it("never RPCs a signable method", async () => {
    const rpc = vi.fn()
    const deps = make_deps({ rpc_call: rpc })
    const handle = create_router(deps)
    await handle({ method: "personal_sign", params: [] })
    expect(rpc).not.toHaveBeenCalled()
  })
})

describe("create_router — wallet-internal", () => {
  it("routes wallet_getCallsStatus to read_calls_status", async () => {
    const read = vi.fn(async () => ({
      id: "0xabc",
      status: 200,
    }))
    const deps = make_deps({ read_calls_status: read })
    const handle = create_router(deps)
    const result = await handle({
      method: "wallet_getCallsStatus",
      params: ["0xabc"],
    })
    expect(result).toEqual({ id: "0xabc", status: 200 })
    expect(read).toHaveBeenCalledWith("0xabc")
  })

  it("throws -32602 when wallet_getCallsStatus has no id", async () => {
    const deps = make_deps()
    const handle = create_router(deps)
    await expect(
      handle({
        method: "wallet_getCallsStatus",
        params: [],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.INVALID_PARAMS,
    })
  })
})

describe("create_router — unsupported", () => {
  it("throws 4200 for any method outside all allowlists", async () => {
    const deps = make_deps()
    const handle = create_router(deps)
    await expect(
      handle({ method: "eth_nope" }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
    await expect(
      handle({ method: "wallet_madeUp" }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
  })

  it("allowlists are non-overlapping", () => {
    const sets = [
      WALLET_STATE_METHODS,
      CHAIN_READ_METHODS,
      SIGNABLE_METHODS,
      WALLET_INTERNAL_METHODS,
    ]
    for (const [i, set_a] of sets.entries()) {
      for (const set_b of sets.slice(i + 1)) {
        for (const method of set_a) {
          expect(set_b.has(method)).toBe(false)
        }
      }
    }
  })
})
