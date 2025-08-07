// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1648 = {
  name: "Pivotal Mainnet",
  shortName: "pivotal-mainnet",
  chain: "Pivotal",
  rpc: ["https://mainnet.pivotalprotocol.com"],
  faucets: [],
  nativeCurrency: {
    name: "Pivotal ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "http://thepivotal.xyz/",
  chainId: 1648,
  networkId: 1648,
  explorers: [
    {
      name: "Pivotal Scan",
      url: "https://pivotalscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
