// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_147 = {
  name: "Flag Mainnet",
  shortName: "FLAG",
  chain: "Flag",
  icon: "flag",
  rpc: ["https://mainnet-rpc.flagscan.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Flag",
    symbol: "FLAG",
    decimals: 18,
  },
  infoURL: "https://flagscan.xyz",
  chainId: 147,
  networkId: 147,
  explorers: [
    {
      name: "Flag Mainnet Explorer",
      url: "https://flagscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
