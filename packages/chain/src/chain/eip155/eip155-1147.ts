// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1147 = {
  name: "Flag Testnet",
  shortName: "tFLAG",
  chain: "Flag",
  icon: "flag",
  rpc: ["https://testnet-rpc.flagscan.xyz"],
  faucets: ["https://faucet.flagscan.xyz"],
  nativeCurrency: {
    name: "Flag Testnet",
    symbol: "FLAG",
    decimals: 18,
  },
  infoURL: "https://testnet-explorer.flagscan.xyz",
  chainId: 1147,
  networkId: 1147,
  explorers: [
    {
      name: "Flag Testnet Explorer",
      url: "https://testnet-explorer.flagscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
