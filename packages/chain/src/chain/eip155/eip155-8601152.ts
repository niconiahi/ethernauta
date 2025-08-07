// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8601152 = {
  name: "Waterfall 8 Test Network",
  shortName: "waterfall",
  chain: "Waterfall Testnet8",
  icon: "waterfall",
  rpc: ["https://rpc.testnet8.waterfall.network/"],
  faucets: ["https://faucet.testnet8.waterfall.network"],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "WATER",
    symbol: "WATER",
    decimals: 18,
  },
  infoURL: "https://waterfall.network",
  chainId: 8601152,
  networkId: 8601152,
  explorers: [],
} satisfies Chain
