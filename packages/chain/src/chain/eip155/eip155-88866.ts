// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_88866 = {
  name: "Matr1x Testnet",
  shortName: "Matr1x-Testnet",
  title: "Matr1x Testnet",
  chain: "Matr1x",
  icon: "matr1x",
  rpc: ["https://testnet-rpc.m1chain.io"],
  faucets: [],
  nativeCurrency: {
    name: "MAX",
    symbol: "MAX",
    decimals: 18,
  },
  infoURL: "https://matr1x.io",
  chainId: 88866,
  networkId: 88866,
  explorers: [
    {
      name: "matr1x testnet",
      url: "https://testnet-scan.m1chain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
