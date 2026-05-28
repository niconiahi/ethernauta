import type { Chain } from "../shared"

export const eip155_36969 = {
  name: "AMA Mainnet",
  shortName: "AMA",
  chain: "AMA",
  rpc: ["https://mainnet-rpc.ama.one"],
  faucets: [],
  nativeCurrency: {
    name: "AMA",
    symbol: "AMA",
    decimals: 9,
  },
  infoURL: "https://ama.one",
  chainId: 36969,
  networkId: 36969,
  slip44: 36969,
  explorers: [
    {
      name: "AMA Explorer Mainnet",
      url: "https://ama-explorer.ddns.net",
      standard: "none",
    },
    {
      name: "AMA Explorer Mainnet Alt",
      url: "https://explorer.ama.one",
      standard: "none",
    },
  ],
  status: "active",
} satisfies Chain
