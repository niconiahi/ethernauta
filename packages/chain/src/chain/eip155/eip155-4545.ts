// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4545 = {
  name: "Emoney Network Mainnet",
  shortName: "emoney",
  chain: "Emoney",
  icon: "emoney",
  rpc: [
    "https://rpc-publicnode.emoney.io/",
    "https://public-node1-rpc.emoney.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Emoney Coin",
    symbol: "EMYC",
    decimals: 18,
  },
  infoURL: "https://emoney.io/",
  chainId: 4545,
  networkId: 4545,
  explorers: [
    {
      name: "EMoney Explorer",
      url: "https://explore.emoney.network",
      standard: "none",
    },
  ],
} satisfies Chain
