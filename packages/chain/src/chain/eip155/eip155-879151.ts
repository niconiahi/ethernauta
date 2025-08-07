// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_879151 = {
  name: "BlocX Mainnet",
  shortName: "blx",
  chain: "BLX",
  icon: "blx",
  rpc: ["https://mainnet-rpc.blxscan.com/"],
  faucets: [],
  nativeCurrency: {
    name: "BlocX",
    symbol: "BLX",
    decimals: 18,
  },
  infoURL: "https://www.blocxchain.org/",
  chainId: 879151,
  networkId: 879151,
  explorers: [
    {
      name: "BlocX Mainnet Explorer",
      url: "https://explorer.blxscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
