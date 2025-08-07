// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_175188 = {
  name: "Chronicle Yellowstone - Lit Protocol Testnet",
  shortName: "lpy",
  chain: "LPY",
  icon: "lit",
  rpc: ["https://yellowstone-rpc.litprotocol.com"],
  faucets: [
    "https://developer.litprotocol.com/support/intro",
  ],
  nativeCurrency: {
    name: "Test LPX",
    symbol: "tstLPX",
    decimals: 18,
  },
  infoURL: "https://litprotocol.com",
  chainId: 175188,
  networkId: 175188,
  explorers: [
    {
      name: "Lit Chronicle Yellowstone Explorer",
      url: "https://yellowstone-explorer.litprotocol.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
