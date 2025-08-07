// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3338 = {
  name: "peaq",
  shortName: "PEAQ",
  chain: "peaq",
  icon: "peaq",
  rpc: [
    "https://quicknode1.peaq.xyz",
    "https://quicknode2.peaq.xyz",
    "https://quicknode3.peaq.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "peaq",
    symbol: "PEAQ",
    decimals: 18,
  },
  infoURL: "https://www.peaq.xyz",
  chainId: 3338,
  networkId: 3338,
  explorers: [
    {
      name: "Subscan",
      url: "https://peaq.subscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
