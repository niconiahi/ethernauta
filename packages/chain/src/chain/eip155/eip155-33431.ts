import type { Chain } from "../shared"

export const eip155_33431 = {
  name: "Edge Testnet",
  shortName: "edge-testnet",
  chain: "ETH",
  rpc: ["https://edge-testnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.edgex.exchange",
  chainId: 33431,
  networkId: 33431,
  explorers: [
    {
      name: "Alchemy Explorer",
      url: "https://edge-testnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
