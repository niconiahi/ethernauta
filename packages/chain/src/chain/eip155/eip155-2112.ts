// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2112 = {
  name: "UCHAIN Mainnet",
  shortName: "uchain",
  chain: "UCHAIN",
  icon: "ucash",
  rpc: ["https://rpc.uchain.link/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "UCASH",
    symbol: "UCASH",
    decimals: 18,
  },
  infoURL: "https://u.cash/",
  chainId: 2112,
  networkId: 2112,
  explorers: [
    {
      name: "uchain.info",
      url: "https://uchain.info",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
