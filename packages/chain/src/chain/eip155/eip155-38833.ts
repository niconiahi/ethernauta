import type { Chain } from "../shared"

export const eip155_38833 = {
  name: "Igra Network",
  shortName: "igra",
  chain: "IGRA",
  icon: "igra",
  rpc: ["https://rpc.igralabs.com:8545"],
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
    name: "iKAS",
    symbol: "iKAS",
    decimals: 18,
  },
  infoURL: "https://igralabs.com",
  chainId: 38833,
  networkId: 38833,
  explorers: [
    {
      name: "Igra Explorer",
      url: "https://explorer.igralabs.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
