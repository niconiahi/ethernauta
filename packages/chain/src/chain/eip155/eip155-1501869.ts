// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1501869 = {
  name: "Waterfall 9 Test Network",
  shortName: "water9",
  chain: "Waterfall TestNet9",
  icon: "waterfall",
  rpc: ["https://rpc.testnet9.waterfall.network"],
  faucets: ["https://faucet.testnet9.waterfall.network"],
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
  chainId: 1501869,
  networkId: 1501869,
  explorers: [
    {
      name: "Waterfall Explorer Testnet9",
      url: "https://explorer.testnet9.waterfall.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
