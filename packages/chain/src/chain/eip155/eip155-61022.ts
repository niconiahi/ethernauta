// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_61022 = {
  name: "Orange Chain Mainnet",
  shortName: "Orange-Chain-Mainnet",
  title: "Orange Chain Mainnet",
  chain: "Orange Chain",
  icon: "orange",
  rpc: [
    "https://rpc.orangechain.xyz",
    "https://hk-rpc.orangechain.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://orangechain.xyz",
  chainId: 61022,
  networkId: 61022,
  explorers: [
    {
      name: "Blockscout",
      url: "https://scan.orangechain.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
