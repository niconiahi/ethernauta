// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20240324 = {
  name: "DeBank Sepolia Testnet",
  shortName: "dbkse",
  chain: "DeBank",
  icon: "debank",
  rpc: ["https://sepolia-rpc.testnet.debank.com"],
  faucets: [],
  nativeCurrency: {
    name: "DeBank USD",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://debank.com",
  chainId: 20240324,
  networkId: 20240324,
  slip44: 1,
  explorers: [
    {
      name: "DeBank Chain Explorer",
      url: "https://sepolia-explorer.testnet.debank.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
