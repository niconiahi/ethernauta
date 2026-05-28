import type { Chain } from "../shared"

export const eip155_920 = {
  name: "Fenine Testnet",
  shortName: "FEN",
  chain: "FEN",
  icon: "fenine",
  rpc: ["https://rpc.fene.app"],
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
    name: "Fenine",
    symbol: "FEN",
    decimals: 18,
  },
  infoURL: "https://fene.app",
  chainId: 920,
  networkId: 920,
  explorers: [
    {
      name: "Fenine Scan",
      url: "https://explorer.fene.app",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
