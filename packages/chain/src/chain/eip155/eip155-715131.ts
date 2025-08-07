// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_715131 = {
  name: "Zether Mainnet",
  shortName: "zth",
  chain: "Zether",
  icon: "zether",
  rpc: [
    "https://rpc.zether.org",
    "https://rpc.zthscan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Zether",
    symbol: "ZTH",
    decimals: 18,
  },
  infoURL: "https://zether.org",
  chainId: 715131,
  networkId: 715131,
  explorers: [
    {
      name: "zthscan",
      url: "https://zthscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
