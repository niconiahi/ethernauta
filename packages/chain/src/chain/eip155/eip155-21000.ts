// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21000 = {
  name: "Action Mainnet",
  shortName: "ACTN",
  chain: "Action",
  icon: "action",
  rpc: ["https://rpc.actionblockchain.org"],
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
    name: "Action",
    symbol: "ACTN",
    decimals: 18,
  },
  infoURL: "https://docs.actioncoin.com",
  chainId: 21000,
  networkId: 21000,
  explorers: [
    {
      name: "Action Mainnet Explorer",
      url: "http://exp.actionblockchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
