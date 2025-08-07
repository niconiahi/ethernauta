// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_326 = {
  name: "GRVT Exchange Testnet",
  shortName: "grvt-sepolia",
  chain: "ETH",
  icon: "grvt",
  rpc: ["https://zkrpc.testnet.grvt.io"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://grvt.io/",
  chainId: 326,
  networkId: 326,
  explorers: [],
} satisfies Chain
