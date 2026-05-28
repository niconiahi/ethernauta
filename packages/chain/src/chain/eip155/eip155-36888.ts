import type { Chain } from "../shared"

export const eip155_36888 = {
  name: "AB Core Mainnet",
  shortName: "abcore",
  chain: "AB",
  rpc: [
    "https://rpc.core.ab.org",
    "https://rpc1.core.ab.org",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "AB",
    symbol: "AB",
    decimals: 18,
  },
  infoURL: "https://ab.org",
  chainId: 36888,
  networkId: 36888,
  explorers: [
    {
      name: "AB Core Explorer",
      url: "https://explorer.core.ab.org",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
