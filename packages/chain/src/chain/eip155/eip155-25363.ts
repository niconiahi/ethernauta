import type { Chain } from "../shared"

export const eip155_25363 = {
  name: "Fluent",
  shortName: "fluent",
  chain: "FLUENT",
  icon: "fluent",
  rpc: ["https://rpc.fluent.xyz"],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.fluent.xyz/",
  chainId: 25363,
  networkId: 25363,
  explorers: [
    {
      name: "Fluent Explorer",
      url: "https://fluentscan.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
} satisfies Chain
