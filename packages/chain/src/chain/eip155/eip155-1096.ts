import type { Chain } from "../shared"

export const eip155_1096 = {
  name: "Xenea Ubusuna",
  shortName: "Xenea",
  title: "Xenea Ubusuna Testnet",
  chain: "TXENE",
  icon: "xenea",
  rpc: ["https://rpc-ubusuna.xeneascan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Xenea Ubusuna Testnet Token",
    symbol: "TXENE",
    decimals: 18,
  },
  infoURL: "https://xenea.io",
  chainId: 1096,
  networkId: 1096,
  explorers: [
    {
      name: "Xenea Ubusuna Testnet Explorer",
      url: "https://ubusuna.xeneascan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
