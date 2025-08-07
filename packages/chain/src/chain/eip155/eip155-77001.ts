// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_77001 = {
  name: "BORAchain mainnet",
  shortName: "BORAchain",
  chain: "BORA",
  icon: "bora",
  rpc: [
    "https://public-node.api.boraportal.com/bora/mainnet",
    "https://public-node.api.boraportal.io/bora/mainnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BORA",
    symbol: "BORA",
    decimals: 18,
  },
  infoURL: "https://www.boraportal.com",
  chainId: 77001,
  networkId: 77001,
  slip44: 8217,
  explorers: [
    {
      name: "BORAchainscope",
      url: "https://scope.boraportal.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
