// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2331 = {
  name: "RSS3 VSL Sepolia Testnet",
  shortName: "rss3-testnet",
  chain: "RSS3",
  icon: "rss3-testnet",
  rpc: ["https://rpc.testnet.rss3.io"],
  faucets: [],
  nativeCurrency: {
    name: "RSS3",
    symbol: "RSS3",
    decimals: 18,
  },
  infoURL: "https://rss3.io",
  chainId: 2331,
  networkId: 2331,
  explorers: [
    {
      name: "RSS3 VSL Sepolia Testnet Scan",
      url: "https://scan.testnet.rss3.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://explorer.testnet.rss3.io/bridge",
      },
    ],
  },
} satisfies Chain
