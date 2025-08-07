// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5373 = {
  name: "Settlus Sepolia Testnet",
  shortName: "setl-sepolia",
  chain: "ETH",
  rpc: ["https://settlus-septestnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://settlus.org",
  chainId: 5373,
  networkId: 5373,
  explorers: [
    {
      name: "Settlus Sepolia Testnet Explorer",
      url: "https://sepolia.settlus.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://settlus-sep-testnet.bridge.alchemy.com/",
      },
    ],
  },
  status: "active",
} satisfies Chain
