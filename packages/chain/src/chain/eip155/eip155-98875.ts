import type { Chain } from "../shared"

export const eip155_98875 = {
  name: "Nillion Network",
  shortName: "nil",
  chain: "ETH",
  icon: "nillion",
  rpc: [
    "https://rpc.nillion.network",
    "wss://rpc.nillion.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://nillion.com/",
  chainId: 98875,
  networkId: 98875,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.nillion.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
