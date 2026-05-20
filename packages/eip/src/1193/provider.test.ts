import { describe, expect, it, vi } from "vitest"
import { ERROR_CODE } from "./error"
import { create_provider } from "./provider"

describe("provider.ts", () => {
  it("should return eth_chainId from configured chains", async () => {
    const provider = create_provider({
      chains: ["0xaa36a7"],
    })
    const id = await provider.request({
      method: "eth_chainId",
    })
    expect(id).toBe("0xaa36a7")
  })

  it("should return net_version as decimal of active chain", async () => {
    const provider = create_provider({
      chains: ["0xaa36a7"],
    })
    const version = await provider.request({
      method: "net_version",
    })
    expect(version).toBe("11155111")
  })

  it("should return empty accounts when not connected", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    const accounts = await provider.request({
      method: "eth_accounts",
    })
    expect(accounts).toEqual([])
  })

  it("should reject wallet_sendCalls with 4200", async () => {
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: vi.fn(),
    })
    await expect(
      provider.request({
        method: "wallet_sendCalls",
        params: [],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
  })

  it("should reject wallet_getCallsStatus with 4200", async () => {
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: vi.fn(),
    })
    await expect(
      provider.request({
        method: "wallet_getCallsStatus",
        params: ["0x1"],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
  })

  it("should return {} for wallet_getCapabilities", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    const caps = await provider.request({
      method: "wallet_getCapabilities",
    })
    expect(caps).toEqual({})
  })

  it("should throw 4200 for unknown methods", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    await expect(
      provider.request({ method: "eth_nope" }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
  })

  it("should throw 4200 when signable method has no handler", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    await expect(
      provider.request({ method: "eth_requestAccounts" }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNSUPPORTED_METHOD,
    })
  })

  it("should route signable methods to the handler", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(["0xabc"])
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    const result = await provider.request({
      method: "eth_requestAccounts",
    })
    expect(handler).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    })
    expect(result).toEqual(["0xabc"])
  })

  it("should cache accounts from eth_requestAccounts and emit", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(["0xabc"])
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    const listener = vi.fn()
    provider.on("accountsChanged", listener)
    await provider.request({
      method: "eth_requestAccounts",
    })
    expect(provider.get_accounts()).toEqual(["0xabc"])
    expect(listener).toHaveBeenCalledWith(["0xabc"])
    const second = await provider.request({
      method: "eth_accounts",
    })
    expect(second).toEqual(["0xabc"])
  })

  it("should emit chainChanged when set_active_chain changes id", () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    const listener = vi.fn()
    provider.on("chainChanged", listener)
    provider.set_active_chain("0xaa36a7")
    expect(listener).toHaveBeenCalledWith("0xaa36a7")
    expect(provider.get_active_chain()).toBe("0xaa36a7")
  })

  it("should not emit chainChanged when set to same id", () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    const listener = vi.fn()
    provider.on("chainChanged", listener)
    provider.set_active_chain("0x1")
    expect(listener).not.toHaveBeenCalled()
  })

  it("should switch active chain for a known id and emit", async () => {
    const provider = create_provider({
      chains: [
        "0x1",
        "0xaa36a7",
      ],
    })
    const listener = vi.fn()
    provider.on("chainChanged", listener)
    const result = await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    })
    expect(result).toBeNull()
    expect(provider.get_active_chain()).toBe("0xaa36a7")
    expect(listener).toHaveBeenCalledWith("0xaa36a7")
  })

  it("should throw 4902 when switching to an unknown chain", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    await expect(
      provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x999" }],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.UNRECOGNIZED_CHAIN,
      data: { chainId: "0x999" },
    })
  })

  it("should throw -32602 on malformed switch params", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    await expect(
      provider.request({
        method: "wallet_switchEthereumChain",
        params: [],
      }),
    ).rejects.toMatchObject({
      code: ERROR_CODE.INVALID_PARAMS,
    })
  })

  it("should register an added chain after wallet_addEthereumChain approval", async () => {
    const handler = vi.fn().mockResolvedValue(null)
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    expect(provider.has_chain("0xaa36a7")).toBe(false)
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xaa36a7",
          chainName: "Sepolia",
          nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.sepolia.org"],
        },
      ],
    })
    expect(provider.has_chain("0xaa36a7")).toBe(true)
  })

  it("should return [] for wallet_getPermissions when not connected", async () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    const perms = await provider.request({
      method: "wallet_getPermissions",
    })
    expect(perms).toEqual([])
  })

  it("should return eth_accounts permission after connect", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(["0xabc"])
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    await provider.request({
      method: "eth_requestAccounts",
    })
    const perms = await provider.request({
      method: "wallet_getPermissions",
    })
    expect(perms).toEqual([
      {
        parentCapability: "eth_accounts",
        caveats: [
          {
            type: "restrictReturnedAccounts",
            value: ["0xabc"],
          },
        ],
      },
    ])
  })

  it("should map wallet_requestPermissions to a connect flow", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(["0xdef"])
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    const result = await provider.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    })
    expect(handler).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    })
    expect(result).toEqual([
      {
        parentCapability: "eth_accounts",
        caveats: [
          {
            type: "restrictReturnedAccounts",
            value: ["0xdef"],
          },
        ],
      },
    ])
    expect(provider.get_accounts()).toEqual(["0xdef"])
  })

  it("should add_chain at runtime", () => {
    const provider = create_provider({
      chains: ["0x1"],
    })
    provider.add_chain("0xaa36a7")
    expect(provider.has_chain("0xaa36a7")).toBe(true)
  })

  it("should not emit accountsChanged for an identical list", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(["0xabc"])
    const provider = create_provider({
      chains: ["0x1"],
      on_signable_request: handler,
    })
    await provider.request({
      method: "eth_requestAccounts",
    })
    const listener = vi.fn()
    provider.on("accountsChanged", listener)
    await provider.request({
      method: "eth_requestAccounts",
    })
    expect(listener).not.toHaveBeenCalled()
  })
})
