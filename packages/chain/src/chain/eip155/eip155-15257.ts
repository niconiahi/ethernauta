// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_15257 = {
  name: "Poodl Testnet",
  shortName: "poodlt",
  chain: "Poodl",
  icon: "poodlIcon",
  rpc: ["https://testnet-rpc.poodl.org"],
  faucets: ["https://faucet.poodl.org"],
  nativeCurrency: {
    name: "Poodl",
    symbol: "POODL",
    decimals: 18,
  },
  infoURL: "https://poodl.org",
  chainId: 15257,
  networkId: 15257,
  explorers: [
    {
      name: "Poodl Testnet Explorer",
      url: "https://testnet.poodl.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
