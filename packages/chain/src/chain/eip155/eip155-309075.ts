// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_309075 = {
  name: "One World Chain Mainnet",
  shortName: "OWCTm",
  chain: "One World Chain",
  icon: "oneWorldChainIcon",
  rpc: ["https://mainnet-rpc.oneworldchain.org"],
  faucets: [],
  nativeCurrency: {
    name: "OWCT",
    symbol: "OWCT",
    decimals: 18,
  },
  infoURL: "https://oneworldchain.org",
  chainId: 309075,
  networkId: 309075,
  explorers: [
    {
      name: "One World Chain Mainnet Explorer",
      url: "https://mainnet.oneworldchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
