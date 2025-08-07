// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_422 = {
  name: "Viridis Mainnet",
  shortName: "vrd",
  chain: "VRD",
  icon: "viridis",
  rpc: ["https://mainnet-rpc.vrd.network"],
  faucets: [],
  nativeCurrency: {
    name: "Viridis Token",
    symbol: "VRD",
    decimals: 18,
  },
  infoURL: "https://viridis.network",
  chainId: 422,
  networkId: 422,
  explorers: [
    {
      name: "Viridis Mainnet",
      url: "https://explorer.vrd.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
