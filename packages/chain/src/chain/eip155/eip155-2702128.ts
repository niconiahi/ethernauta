// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2702128 = {
  name: "Xterio Chain (ETH)",
  shortName: "xterio",
  chain: "Xterio",
  rpc: ["https://xterio-eth.alt.technology"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://xter.io",
  chainId: 2702128,
  networkId: 2702128,
  explorers: [
    {
      name: "Xterio Chain (ETH) Explorer",
      url: "https://eth.xterscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
