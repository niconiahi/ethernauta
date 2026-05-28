import type { Chain } from "../shared"

export const eip155_963369 = {
  name: "AVI Coin",
  shortName: "avi",
  chain: "AVI",
  rpc: ["https://rpc.avicoin.org"],
  faucets: [],
  nativeCurrency: {
    name: "AVI Coin",
    symbol: "AVI",
    decimals: 18,
  },
  infoURL: "https://www.avicoin.org",
  chainId: 963369,
  networkId: 963369,
  explorers: [
    {
      name: "AVI Coin Explorer",
      url: "https://explorer.avicoin.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
