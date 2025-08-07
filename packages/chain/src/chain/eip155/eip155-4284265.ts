// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4284265 = {
  name: "Zuux chain testnet",
  shortName: "zuuxchain",
  title: "Zuux chain testnet",
  chain: "zuuxchain",
  icon: "zuuxchain",
  rpc: ["https://rpc.zuux.network"],
  faucets: ["https://www.zuuxlend.xyz/faucet"],
  features: [
    {
      name: "none",
    },
  ],
  nativeCurrency: {
    name: "ZUUX",
    symbol: "ZUUX",
    decimals: 18,
  },
  infoURL: "https://www.zuux.network",
  chainId: 4284265,
  networkId: 4284265,
  explorers: [
    {
      name: "Zuux chain explorer",
      url: "https://blockscout.zuux.network",
      standard: "EIP3091",
    },
    {
      name: "Zuux chain explorer",
      url: "https://explorer.zuux.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
