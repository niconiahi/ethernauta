// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_336666 = {
  name: "UPchain Mainnet",
  shortName: "UPchain-mainnet",
  chain: "UPchain",
  icon: "up",
  rpc: ["https://rpc.uniport.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "UBTC",
    symbol: "UBTC",
    decimals: 18,
  },
  infoURL: "https://uniport.network",
  chainId: 336666,
  networkId: 336666,
  explorers: [
    {
      name: "UPchain Mainnet Explorer",
      url: "https://explorer.uniport.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
