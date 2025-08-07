// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_661898459 = {
  name: "Smart Mainnet",
  shortName: "smart",
  chain: "SMART",
  icon: "smart",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Smart",
    symbol: "SMART",
    decimals: 6,
  },
  infoURL: "https://smartblockchain.com",
  chainId: 661898459,
  networkId: 661898459,
  slip44: 783,
  explorers: [
    {
      name: "smartexplorer",
      url: "https://smartexplorer.com",
      standard: "none",
    },
  ],
} satisfies Chain
