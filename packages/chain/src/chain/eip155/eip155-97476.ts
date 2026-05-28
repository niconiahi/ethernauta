import type { Chain } from "../shared"

export const eip155_97476 = {
  name: "Doma Testnet",
  shortName: "doma-testnet",
  title: "Doma Testnet",
  chain: "ETH",
  icon: "doma",
  rpc: ["https://rpc-testnet.doma.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://doma.xyz",
  chainId: 97476,
  networkId: 97476,
  explorers: [
    {
      name: "Doma Testnet Explorer",
      url: "https://explorer-testnet.doma.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge-testnet.doma.xyz",
      },
    ],
  },
  status: "active",
} satisfies Chain
