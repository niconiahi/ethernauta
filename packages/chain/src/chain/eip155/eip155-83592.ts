import type { Chain } from "../shared"

export const eip155_83592 = {
  name: "Katron AI Mainnet",
  shortName: "ktn",
  chain: "KTN",
  icon: "ktn",
  rpc: [
    "https://blockchain-rpc1.katronai.com",
    "https://blockchain-rpc2.katronai.com",
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
    name: "Katron AI",
    symbol: "KTN",
    decimals: 18,
  },
  infoURL: "https://network.katronai.com",
  chainId: 83592,
  networkId: 83592,
  explorers: [
    {
      name: "ktnscan",
      url: "https://ktnscan.katronai.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
