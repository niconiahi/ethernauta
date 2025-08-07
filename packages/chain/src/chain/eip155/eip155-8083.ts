// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8083 = {
  name: "Shardeum Testnet",
  shortName: "ShardeumTestnet",
  chain: "ShardeumTestnet",
  icon: "shardeum",
  rpc: ["https://api-testnet.shardeum.org/"],
  faucets: [],
  nativeCurrency: {
    name: "Shardeum Test SHM",
    symbol: "SHM",
    decimals: 18,
  },
  infoURL: "https://docs.shardeum.org/",
  chainId: 8083,
  networkId: 8083,
  explorers: [
    {
      name: "Shardeum Testnet Explorer",
      url: "https://explorer-testnet.shardeum.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
