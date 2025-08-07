// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2311 = {
  name: "Chronicle Vesuvius - Lit Protocol Testnet",
  shortName: "lpv",
  chain: "LPV",
  icon: "lit",
  rpc: ["https://vesuvius-rpc.litprotocol.com"],
  faucets: [
    "https://developer.litprotocol.com/support/intro",
  ],
  nativeCurrency: {
    name: "Test LPX",
    symbol: "tstLPX",
    decimals: 18,
  },
  infoURL: "https://litprotocol.com",
  chainId: 2311,
  networkId: 2311,
  explorers: [
    {
      name: "Lit Chronicle Vesuvius Explorer",
      url: "https://vesuvius-explorer.litprotocol.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
