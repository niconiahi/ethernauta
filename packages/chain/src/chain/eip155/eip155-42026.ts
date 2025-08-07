// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42026 = {
  name: "Donatuz",
  shortName: "donatuz",
  chain: "ETH",
  rpc: ["https://rpc.donatuz.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.donatuz.com",
  chainId: 42026,
  networkId: 42026,
  explorers: [
    {
      name: "Donatuz Explorer",
      url: "https://explorer.donatuz.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
