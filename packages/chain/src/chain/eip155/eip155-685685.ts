import type { Chain } from "../shared"

export const eip155_685685 = {
  name: "Gensyn Testnet",
  shortName: "gensyn-testnet",
  chain: "Gensyn",
  icon: "gensyn-testnet",
  rpc: ["https://gensyn-testnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://gensyn.network/",
  chainId: 685685,
  networkId: 685685,
  explorers: [
    {
      name: "Gensyn Testnet Explorer",
      url: "https://gensyn-testnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [],
  },
  status: "active",
} satisfies Chain
