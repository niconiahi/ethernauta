// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1918988905 = {
  name: "RARI Chain Testnet",
  shortName: "rari-testnet",
  chain: "RARI",
  rpc: ["https://testnet.rpc.rarichain.org/http"],
  faucets: [],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://rarichain.org/",
  chainId: 1918988905,
  networkId: 1918988905,
  explorers: [
    {
      name: "rarichain-testnet-explorer",
      url: "https://explorer.rarichain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
