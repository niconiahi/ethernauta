import type { Chain } from "../shared"

export const eip155_2366 = {
  name: "KiteAI",
  shortName: "KiteAI",
  chain: "KiteAI",
  icon: "kite",
  rpc: ["https://rpc.gokite.ai"],
  faucets: [],
  nativeCurrency: {
    name: "Kite",
    symbol: "KITE",
    decimals: 18,
  },
  infoURL: "https://gokite.ai/",
  chainId: 2366,
  networkId: 2366,
  slip44: 1,
  explorers: [
    {
      name: "Kitescan",
      url: "https://kitescan.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
