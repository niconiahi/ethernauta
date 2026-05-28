import type { Chain } from "../shared"

export const eip155_1783 = {
  name: "KiiChain",
  shortName: "kiichain",
  chain: "KII",
  icon: "kii",
  rpc: ["https://json-rpc.kiivalidator.com"],
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
    name: "Kii",
    symbol: "KII",
    decimals: 18,
  },
  infoURL: "https://kiichain.io",
  chainId: 1783,
  networkId: 1783,
  explorers: [
    {
      name: "KiiExplorer",
      url: "https://explorer.kiichain.io",
      standard: "none",
    },
  ],
} satisfies Chain
