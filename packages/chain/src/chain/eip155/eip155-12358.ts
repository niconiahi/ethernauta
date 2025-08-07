// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12358 = {
  name: "GDPR Mainnet",
  shortName: "gdpr",
  chain: "GDPR",
  rpc: ["https://rpc.gdprchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "GDPR",
    symbol: "GDPR",
    decimals: 18,
  },
  infoURL: "https://explorer.gdprchain.com",
  chainId: 12358,
  networkId: 12358,
  explorers: [
    {
      name: "GDPR Mainnet Explorer (Blockscout)",
      url: "https://explorer.gdprchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
