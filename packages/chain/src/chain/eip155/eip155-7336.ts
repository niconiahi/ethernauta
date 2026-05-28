import type { Chain } from "../shared"

export const eip155_7336 = {
  name: "Pruv Testnet",
  shortName: "pruvtestnet",
  chain: "PRUV Testnet",
  icon: "pruv",
  rpc: [
    "https://rpc.testnet.pruv.network",
    "wss://rpc.testnet.pruv.network",
  ],
  faucets: ["https://faucet.testnet.pruv.network"],
  nativeCurrency: {
    name: "Pruv",
    symbol: "PRUV",
    decimals: 18,
  },
  infoURL: "https://pruv.gitbook.io/pruv-network/",
  chainId: 7336,
  networkId: 7336,
  explorers: [
    {
      name: "Pruv Testnet Explorer",
      url: "https://explorer.testnet.pruv.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
