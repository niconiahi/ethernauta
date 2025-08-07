// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1750 = {
  name: "Metal L2",
  shortName: "metall2",
  chain: "Metal L2",
  icon: "metal",
  rpc: ["https://rpc.metall2.com"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://metall2.com",
  chainId: 1750,
  networkId: 1750,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.metall2.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
