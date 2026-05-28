import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import { AddEthereumChainParameterSchema } from "./wallet_addEthereumChain"

describe("wallet_addEthereumChain.ts", () => {
  it("should accept a complete EIP-3085 chain parameter", () => {
    const param = {
      chainId: "0xaa36a7",
      chainName: "Sepolia",
      nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.sepolia.org"],
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    }
    expect(() =>
      parse(AddEthereumChainParameterSchema, param),
    ).not.toThrow()
  })

  it("should accept the minimal required fields", () => {
    const param = {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://eth.llamarpc.com"],
    }
    expect(() =>
      parse(AddEthereumChainParameterSchema, param),
    ).not.toThrow()
  })

  it("should reject when rpcUrls contains a non-url string", () => {
    const param = {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["not-a-url"],
    }
    expect(() =>
      parse(AddEthereumChainParameterSchema, param),
    ).toThrow()
  })

  it("should reject when decimals is a string", () => {
    const param = {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: "18",
      },
      rpcUrls: ["https://eth.llamarpc.com"],
    }
    expect(() =>
      parse(AddEthereumChainParameterSchema, param),
    ).toThrow()
  })

  it("should reject when chainId is missing", () => {
    const param = {
      chainName: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://eth.llamarpc.com"],
    }
    expect(() =>
      parse(AddEthereumChainParameterSchema, param),
    ).toThrow()
  })
})
