// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7007 = {
  name: "BST Chain",
  shortName: "BSTC",
  chain: "BSTC",
  icon: "bstc",
  rpc: ["https://rpc.bstchain.io/"],
  faucets: [],
  nativeCurrency: {
    name: "BST Chain",
    symbol: "BSTC",
    decimals: 18,
  },
  infoURL: "https://bstchain.io",
  chainId: 7007,
  networkId: 7007,
  explorers: [
    {
      name: "blockscout",
      url: "https://bstscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
