// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_193939 = {
  name: "R0AR Chain",
  shortName: "R0AR-Chain",
  chain: "R0AR Chain",
  rpc: ["https://rpc-r0ar.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://r0arscan.io",
  chainId: 193939,
  networkId: 193939,
  explorers: [
    {
      name: "tracehawk",
      url: "https://r0arscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
