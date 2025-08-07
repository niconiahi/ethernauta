// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_145 = {
  name: "SoraAI Testnet",
  shortName: "SETH",
  chain: "SETH",
  icon: "ethereum",
  rpc: ["https://rpc-testnet.soraai.bot"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "SoraETH",
    symbol: "SETH",
    decimals: 18,
  },
  infoURL: "https://soraai.bot",
  chainId: 145,
  networkId: 145,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.soraai.bot",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.soraai.bot",
      },
    ],
  },
} satisfies Chain
