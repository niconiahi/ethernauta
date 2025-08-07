// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10096 = {
  name: "MetaNova Verse",
  shortName: "mnv",
  chain: "MNV",
  rpc: ["https://web3.metanovaverse.com"],
  faucets: [],
  features: [],
  nativeCurrency: {
    name: "MNV",
    symbol: "MNV",
    decimals: 18,
  },
  infoURL: "https://metanovaverse.com/",
  chainId: 10096,
  networkId: 10096,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.metanovaverse.com",
      standard: "EIP3091",
    },
    {
      name: "Cosmos Explorer (Ping)",
      url: "https://ping.metanovaverse.com/metanovaverse",
      standard: "none",
    },
  ],
} satisfies Chain
