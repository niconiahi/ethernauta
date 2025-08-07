// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7776 = {
  name: "PandaSea Mainnet",
  shortName: "pandaSea-mainnet",
  chain: "PandaSea",
  rpc: ["https://rpc1.pandasea.io"],
  faucets: [],
  nativeCurrency: {
    name: "PandaSea Coin",
    symbol: "PANDA",
    decimals: 18,
  },
  infoURL: "",
  chainId: 7776,
  networkId: 7776,
  explorers: [
    {
      name: "Tracehawk",
      url: "https://pandaseascan.com",
      standard: "none",
    },
  ],
} satisfies Chain
