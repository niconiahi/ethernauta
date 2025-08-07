// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_103 = {
  name: "WorldLand Mainnet",
  shortName: "WLC",
  chain: "Worldland",
  icon: "worldland",
  rpc: [
    "https://seoul.worldland.foundation",
    "https://seoul2.worldland.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Worldland",
    symbol: "WLC",
    decimals: 18,
  },
  infoURL: "https://worldland.foundation",
  chainId: 103,
  networkId: 103,
  explorers: [
    {
      name: "Worldland Explorer",
      url: "https://scan.worldland.foundation",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
