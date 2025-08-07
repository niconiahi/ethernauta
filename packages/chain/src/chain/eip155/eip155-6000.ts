// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6000 = {
  name: "BounceBit Testnet",
  shortName: "bouncebit-testnet",
  chain: "BounceBit",
  icon: "bouncebit",
  rpc: ["https://fullnode-testnet.bouncebitapi.com/"],
  faucets: [],
  nativeCurrency: {
    name: "BounceBit",
    symbol: "BB",
    decimals: 18,
  },
  infoURL: "https://bouncebit.io",
  chainId: 6000,
  networkId: 6000,
  explorers: [
    {
      name: "BBScan Testnet Explorer",
      url: "https://bbscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
