import type { Chain } from "../shared"

export const eip155_190415 = {
  name: "HPP Mainnet",
  shortName: "hpp-mainnet",
  chain: "ETH",
  icon: "hpp",
  rpc: ["https://mainnet.hpp.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.hpp.io",
  chainId: 190415,
  networkId: 190415,
  explorers: [
    {
      name: "HPP Mainnet Explorer",
      url: "https://explorer.hpp.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge",
      },
    ],
  },
} satisfies Chain
