import type { Chain } from "../shared"

export const eip155_8283 = {
  name: "StableNet Testnet",
  shortName: "stablenet-testnet",
  chain: "StableNet",
  rpc: [
    "https://api.test.stablenet.network",
    "wss://ws.test.stablenet.network",
  ],
  faucets: ["https://faucet.stablenet.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
    {
      name: "EIP7702",
    },
    {
      name: "EIP2930",
    },
  ],
  nativeCurrency: {
    name: "WKRC",
    symbol: "WKRC",
    decimals: 18,
  },
  infoURL: "https://stablenet.network",
  chainId: 8283,
  networkId: 8283,
  explorers: [
    {
      name: "StableNet Testnet Explorer",
      url: "https://explorer.stablenet.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
