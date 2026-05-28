import type { Chain } from "../shared"

export const eip155_4457 = {
  name: "Oxin Chain",
  shortName: "oxin",
  chain: "OXIN",
  icon: "oxin",
  rpc: [
    "https://rpc.oxinchain.io",
    "https://rpc1.oxinchain.io",
    "https://rpc2.oxinchain.io",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Oxin",
    symbol: "OXIN",
    decimals: 18,
  },
  infoURL: "https://oxinchain.io",
  chainId: 4457,
  networkId: 4457,
  explorers: [
    {
      name: "oxinscan",
      url: "https://scan.oxinchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
