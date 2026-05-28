import type { Chain } from "../shared"

export const eip155_685689 = {
  name: "Gensyn Mainnet",
  shortName: "gensyn-mainnet",
  chain: "Gensyn",
  icon: "gensyn",
  rpc: ["https://gensyn-mainnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://gensyn.network/",
  chainId: 685689,
  networkId: 685689,
  explorers: [
    {
      name: "Gensyn Mainnet Explorer",
      url: "https://gensyn-mainnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://stargate.finance/bridge",
      },
    ],
  },
  status: "active",
} satisfies Chain
