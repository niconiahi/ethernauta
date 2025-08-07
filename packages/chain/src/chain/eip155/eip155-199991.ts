// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_199991 = {
  name: "MAZZE Testnet",
  shortName: "MAZZE",
  chain: "MAZZE Testnet",
  icon: "mazze",
  rpc: ["https://testnet-rpc.mazze.io/"],
  faucets: ["https://faucet.mazze.io/"],
  nativeCurrency: {
    name: "MAZZE Testnet",
    symbol: "MAZZE",
    decimals: 18,
  },
  infoURL: "https://mazze.io/",
  chainId: 199991,
  networkId: 199991,
  explorers: [
    {
      name: "MAZZE Testnet Explorer",
      url: "https://mazzescan.io",
      standard: "none",
    },
  ],
} satisfies Chain
