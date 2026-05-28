import type { Chain } from "../shared"

export const eip155_4114 = {
  name: "Citrea Mainnet",
  shortName: "citrea",
  chain: "Citrea",
  icon: "citrea",
  rpc: ["https://rpc.mainnet.citrea.xyz"],
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
    name: "Citrea BTC",
    symbol: "cBTC",
    decimals: 18,
  },
  infoURL: "https://citrea.xyz",
  chainId: 4114,
  networkId: 4114,
  explorers: [
    {
      name: "Citrea Mainnet Explorer",
      url: "https://explorer.mainnet.citrea.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
