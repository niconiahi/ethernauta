// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_250 = {
  name: "Fantom Opera",
  shortName: "ftm",
  chain: "FTM",
  icon: "fantom",
  rpc: [
    "https://rpc.ftm.tools",
    "https://fantom-rpc.publicnode.com",
    "wss://fantom-rpc.publicnode.com",
    "https://fantom.drpc.org",
    "wss://fantom.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  infoURL: "https://fantom.foundation",
  chainId: 250,
  networkId: 250,
  explorers: [
    {
      name: "ftmscan",
      url: "https://ftmscan.com",
      standard: "EIP3091",
    },
    {
      name: "dexguru",
      url: "https://fantom.dex.guru",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
