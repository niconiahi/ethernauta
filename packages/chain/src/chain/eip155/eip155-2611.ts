// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2611 = {
  name: "Redlight Chain Mainnet",
  shortName: "REDLC",
  chain: "REDLC",
  rpc: ["https://dataseed2.redlightscan.finance"],
  faucets: [],
  nativeCurrency: {
    name: "Redlight Coin",
    symbol: "REDLC",
    decimals: 18,
  },
  infoURL: "https://redlight.finance/",
  chainId: 2611,
  networkId: 2611,
  explorers: [
    {
      name: "REDLC Explorer",
      url: "https://redlightscan.finance",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
