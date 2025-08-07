// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_82459 = {
  name: "Smart Layer Network Testnet",
  shortName: "tSLN",
  chain: "SLN",
  rpc: ["https://rpc.test.smartlayer.network"],
  faucets: [],
  nativeCurrency: {
    name: "Service Unit Token",
    symbol: "SU",
    decimals: 18,
  },
  infoURL: "https://www.smartlayer.network/",
  chainId: 82459,
  networkId: 82459,
  explorers: [
    {
      name: "SLN Testnet Explorer",
      url: "https://explorer.test.smartlayer.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
