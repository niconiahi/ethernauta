// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5321 = {
  name: "ITX Testnet",
  shortName: "itx-testnet",
  chain: "ITX",
  rpc: ["https://rpc.testnet.itxchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "ITX",
    symbol: "ITX",
    decimals: 18,
  },
  infoURL: "https://explorer.testnet.itxchain.com",
  chainId: 5321,
  networkId: 5321,
  explorers: [
    {
      name: "ITX Testnet Explorer (Blockscout)",
      url: "https://explorer.testnet.itxchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
