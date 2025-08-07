// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5112 = {
  name: "Ham",
  shortName: "ham",
  chain: "Ham",
  icon: "ham",
  rpc: ["https://rpc.ham.fun"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ham.fun",
  chainId: 5112,
  networkId: 5112,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.ham.fun",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
