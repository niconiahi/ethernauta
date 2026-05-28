import type { Chain } from "../shared"

export const eip155_179 = {
  name: "Abey Mainnet",
  shortName: "abey",
  chain: "Abey",
  icon: "abey",
  rpc: ["https://rpc.abeychain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "ABEY",
    symbol: "ABEY",
    decimals: 18,
  },
  infoURL: "https://abey.com",
  chainId: 179,
  networkId: 179,
  explorers: [
    {
      name: "abeyscan",
      url: "https://abeyscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
