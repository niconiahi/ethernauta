import type { Chain } from "../shared"

export const eip155_68414 = {
  name: "Henesys",
  shortName: "nxpc",
  chain: "Henesys",
  icon: "nexpace",
  rpc: ["https://henesys-rpc.msu.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "NEXPACE",
    symbol: "NXPC",
    decimals: 18,
  },
  infoURL: "https://nexpace.io",
  chainId: 68414,
  networkId: 68414,
  explorers: [
    {
      name: "Xangle MSU Explorer",
      url: "https://msu-explorer.xangle.io",
      standard: "EIP3091",
    },
    {
      name: "Avalanche Explorer",
      url: "https://subnets.avax.network/henesys",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
