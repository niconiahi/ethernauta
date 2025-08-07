// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_25925 = {
  name: "KUB Testnet",
  shortName: "kubt",
  chain: "KUB",
  icon: "kub",
  rpc: [
    "https://rpc-testnet.bitkubchain.io",
    "wss://wss-testnet.bitkubchain.io",
  ],
  faucets: ["https://faucet.kubchain.com"],
  nativeCurrency: {
    name: "KUB Coin",
    symbol: "tKUB",
    decimals: 18,
  },
  infoURL: "https://www.kubchain.com/",
  chainId: 25925,
  networkId: 25925,
  slip44: 1,
  explorers: [
    {
      name: "KUB Testnet Explorer",
      url: "https://testnet.kubscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
