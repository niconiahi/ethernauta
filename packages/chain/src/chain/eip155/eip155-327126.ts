// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_327126 = {
  name: "WABA Chain Testnet",
  shortName: "waba",
  chain: "WABA Mainnet",
  icon: "waba",
  rpc: ["https://rpc.wabaworld.com"],
  faucets: [],
  nativeCurrency: {
    name: "WABA",
    symbol: "WABA",
    decimals: 18,
  },
  infoURL: "https://www.wabanetwork.org",
  chainId: 327126,
  networkId: 327126,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.wabaworld.com",
      standard: "none",
    },
  ],
} satisfies Chain
