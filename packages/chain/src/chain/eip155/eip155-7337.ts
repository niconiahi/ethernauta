import type { Chain } from "../shared"

export const eip155_7337 = {
  name: "Pruv Mainnet",
  shortName: "pruvmainnet",
  chain: "PRUV Mainnet",
  icon: "pruv",
  rpc: [
    "https://rpc.pruv.network",
    "wss://rpc.pruv.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Pruv",
    symbol: "PRUV",
    decimals: 18,
  },
  infoURL: "https://pruv.gitbook.io/pruv-network/",
  chainId: 7337,
  networkId: 7337,
  explorers: [
    {
      name: "Pruv Explorer",
      url: "https://explorer.pruv.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
