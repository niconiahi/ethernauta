// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_16481 = {
  name: "Pivotal Sepolia",
  shortName: "pivotal-sepolia",
  chain: "Pivotal",
  rpc: ["https://sepolia.pivotalprotocol.com"],
  faucets: [],
  nativeCurrency: {
    name: "Pivotal ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "http://thepivotal.xyz/",
  chainId: 16481,
  networkId: 16481,
  explorers: [
    {
      name: "Pivotal Scan",
      url: "https://sepolia.pivotalscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
