import type { Chain } from "../shared"

export const eip155_100611 = {
  name: "Monsoon Alpha",
  shortName: "monsoon-alpha",
  chain: "MONSOON ALPHA",
  icon: "monsoon",
  rpc: ["https://alpha.monsoon.rainfall.one"],
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
    name: "RDL",
    symbol: "RDL",
    decimals: 18,
  },
  infoURL: "",
  chainId: 100611,
  networkId: 100611,
  explorers: [
    {
      name: "Monsoon Scan",
      url: "https://scout.alpha.monsoon.rainfall.one",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
