// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_175190 = {
  name: "Chronicle Loa - Lit Protocol Testnet",
  shortName: "lpl",
  chain: "LPL",
  icon: "lit",
  rpc: ["https://loa-rpc.litprotocol.com"],
  faucets: [
    "https://developer.litprotocol.com/support/intro",
  ],
  nativeCurrency: {
    name: "Test Lit",
    symbol: "tLit",
    decimals: 18,
  },
  infoURL: "https://litprotocol.com",
  chainId: 175190,
  networkId: 175190,
  explorers: [
    {
      name: "Lit Chronicle Loa Explorer",
      url: "https://loa-explorer.litprotocol.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
