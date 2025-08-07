// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9395 = {
  name: "Evoke Mainnet",
  shortName: "MTHN",
  chain: "MTHN",
  icon: "mthn",
  rpc: ["https://mainnet-rpc.evokescan.org"],
  faucets: [],
  nativeCurrency: {
    name: "MTHN",
    symbol: "MTHN",
    decimals: 18,
  },
  infoURL: "https://explorer.evokescan.org",
  chainId: 9395,
  networkId: 9395,
  explorers: [
    {
      name: "Evoke SmartChain Explorer",
      url: "https://explorer.evokescan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
