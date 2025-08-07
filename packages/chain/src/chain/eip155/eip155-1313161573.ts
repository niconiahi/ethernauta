// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1313161573 = {
  name: "Tuxappcoin",
  shortName: "tuxa",
  chain: "NEAR",
  icon: "tuxa",
  rpc: ["https://rpc-0x4e454165.aurora-cloud.dev"],
  faucets: [],
  nativeCurrency: {
    name: "TUXA",
    symbol: "TUXA",
    decimals: 18,
  },
  infoURL: "https://x.com/tuxapp_coin",
  chainId: 1313161573,
  networkId: 1313161573,
  explorers: [
    {
      name: "TUXA explorer",
      url: "https://explorer.tuxa.aurora.dev",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
