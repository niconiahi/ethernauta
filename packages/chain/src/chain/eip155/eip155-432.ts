import type { Chain } from "../shared"

export const eip155_432 = {
  name: "NutriEmp Chain",
  shortName: "nutriemp",
  chain: "nutriemp-chain",
  icon: "GRAMZ",
  rpc: [
    "https://rpc.nutriemp-chain.link",
    "https://rpc.nutriemp.com",
  ],
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
    name: "GRAMZ",
    symbol: "GRAMZ",
    decimals: 18,
  },
  infoURL: "https://nutriemp.com",
  chainId: 432,
  networkId: 432,
  explorers: [
    {
      name: "NutriEmp Explorer",
      url: "https://explorer.nutriemp-chain.link",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
