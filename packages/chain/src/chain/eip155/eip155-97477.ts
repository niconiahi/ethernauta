import type { Chain } from "../shared"

export const eip155_97477 = {
  name: "Doma",
  shortName: "doma",
  title: "Doma",
  chain: "ETH",
  icon: "doma",
  rpc: ["https://rpc.doma.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://doma.xyz",
  chainId: 97477,
  networkId: 97477,
  explorers: [
    {
      name: "Doma Explorer",
      url: "https://explorer.doma.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "active",
} satisfies Chain
