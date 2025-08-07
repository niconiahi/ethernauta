// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8217 = {
  name: "Kaia Mainnet",
  shortName: "kaia-mainnet",
  chain: "KAIA",
  rpc: ["https://public-en.node.kaia.io"],
  faucets: [],
  nativeCurrency: {
    name: "KAIA",
    symbol: "KAIA",
    decimals: 18,
  },
  infoURL: "https://kaia.io",
  chainId: 8217,
  networkId: 8217,
  slip44: 8217,
  explorers: [
    {
      name: "Kaiascope",
      url: "https://kaiascope.com",
      standard: "EIP3091",
    },
    {
      name: "Kaiascan",
      url: "https://kaiascan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
