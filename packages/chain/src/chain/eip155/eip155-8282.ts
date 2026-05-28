import type { Chain } from "../shared"

export const eip155_8282 = {
  name: "StableNet Mainnet",
  shortName: "stablenet",
  chain: "StableNet",
  rpc: [],
  faucets: [],
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
  chainId: 8282,
  networkId: 8282,
  explorers: [],
  status: "incubating",
} satisfies Chain
