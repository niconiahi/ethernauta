import type { Chain } from "../shared"

export const eip155_3838 = {
  name: "FAVO Mainnet",
  shortName: "favo",
  chain: "FAVO",
  icon: "favo",
  rpc: ["https://rpc.favoscan.com"],
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
    name: "FAVO",
    symbol: "FAVO",
    decimals: 18,
  },
  infoURL: "https://www.favoscan.com",
  chainId: 3838,
  networkId: 3838,
  explorers: [
    {
      name: "favoscan",
      url: "https://www.favoscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
