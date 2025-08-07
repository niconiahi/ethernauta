// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21363 = {
  name: "Lestnet",
  shortName: "leth",
  chain: "LETH",
  icon: "lestnet",
  rpc: ["https://service.lestnet.org"],
  faucets: [],
  nativeCurrency: {
    name: "Lestnet Ether",
    symbol: "LETH",
    decimals: 18,
  },
  infoURL: "https://lestnet.org",
  chainId: 21363,
  networkId: 21363,
  explorers: [
    {
      name: "Lestnet Explorer",
      url: "https://explore.lestnet.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
