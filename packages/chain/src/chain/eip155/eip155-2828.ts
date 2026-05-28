import type { Chain } from "../shared"

export const eip155_2828 = {
  name: "Candy Chain",
  shortName: "candy",
  chain: "CANDY",
  rpc: ["https://publicrpc.candychain.io"],
  faucets: [],
  nativeCurrency: {
    name: "CANDY",
    symbol: "CANDY",
    decimals: 18,
  },
  infoURL: "https://candychain.io",
  chainId: 2828,
  networkId: 2828,
  explorers: [
    {
      name: "Candy Chain Explorer",
      url: "https://explorer.candychain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
