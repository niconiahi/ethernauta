import type { Chain } from "../shared"

export const eip155_3343 = {
  name: "Edge",
  shortName: "edge",
  chain: "ETH",
  rpc: ["https://edge-mainnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.edgex.exchange",
  chainId: 3343,
  networkId: 3343,
  explorers: [
    {
      name: "Alchemy Explorer",
      url: "https://edge-mainnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
