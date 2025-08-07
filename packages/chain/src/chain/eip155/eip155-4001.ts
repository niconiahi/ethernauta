// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4001 = {
  name: "Peperium Chain Testnet",
  shortName: "PERIUM",
  chain: "PERIUM",
  icon: "peperium",
  rpc: ["https://rpc-testnet.peperium.io"],
  faucets: [],
  nativeCurrency: {
    name: "Peperium Chain Testnet",
    symbol: "PERIUM",
    decimals: 18,
  },
  infoURL: "https://peperium.io",
  chainId: 4001,
  networkId: 4001,
  slip44: 1,
  explorers: [
    {
      name: "Peperium Chain Explorer",
      url: "https://scan-testnet.peperium.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
