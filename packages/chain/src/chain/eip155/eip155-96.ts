// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_96 = {
  name: "KUB Mainnet",
  shortName: "kub",
  chain: "KUB",
  icon: "kub",
  rpc: [
    "https://rpc.bitkubchain.io",
    "wss://wss.bitkubchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KUB Coin",
    symbol: "KUB",
    decimals: 18,
  },
  infoURL: "https://www.kubchain.com/",
  chainId: 96,
  networkId: 96,
  explorers: [
    {
      name: "KUB Mainnet Explorer",
      url: "https://kubscan.com",
      standard: "none",
    },
  ],
  redFlags: ["reusedChainId"],
} satisfies Chain
