import type { Chain } from "../shared"

export const eip155_2691 = {
  name: "Splendor Mainnet",
  shortName: "spld",
  chain: "SPLENDOR",
  icon: "splendor",
  rpc: [
    "https://mainnet-rpc.splendor.org",
    "https://splendor-rpc.org/",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Splendor Token",
    symbol: "SPLD",
    decimals: 18,
  },
  infoURL: "https://splendor.org",
  chainId: 2691,
  networkId: 2691,
  explorers: [
    {
      name: "Splendor Explorer",
      url: "https://explorer.splendor.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
