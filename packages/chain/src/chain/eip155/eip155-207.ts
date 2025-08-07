// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_207 = {
  name: "VinuChain Network",
  shortName: "VC",
  chain: "VinuChain",
  icon: "vitainu",
  rpc: ["https://vinuchain-rpc.com"],
  faucets: [],
  nativeCurrency: {
    name: "VinuChain",
    symbol: "VC",
    decimals: 18,
  },
  infoURL: "https://vitainu.org",
  chainId: 207,
  networkId: 207,
  explorers: [
    {
      name: "VinuScan",
      url: "https://vinuscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
