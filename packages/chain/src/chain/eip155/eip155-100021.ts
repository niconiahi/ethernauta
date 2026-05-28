import type { Chain } from "../shared"

export const eip155_100021 = {
  name: "Sova",
  shortName: "sova",
  chain: "ETH",
  icon: "sova",
  rpc: ["https://rpc.sova.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://sova.io",
  chainId: 100021,
  networkId: 100021,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.sova.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
