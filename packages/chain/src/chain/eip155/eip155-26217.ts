import type { Chain } from "../shared"

export const eip155_26217 = {
  name: "Integra",
  shortName: "integra",
  chain: "Integra",
  rpc: ["https://evm.integralayer.com"],
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
    name: "Integra",
    symbol: "IRL",
    decimals: 18,
  },
  infoURL: "https://integralayer.com",
  chainId: 26217,
  networkId: 26217,
  explorers: [
    {
      name: "Integra Explorer",
      url: "https://scan.integralayer.com",
      standard: "EIP3091",
    },
    {
      name: "Integra Blockscout",
      url: "https://blockscout.integralayer.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
