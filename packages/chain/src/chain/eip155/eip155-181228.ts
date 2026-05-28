import type { Chain } from "../shared"

export const eip155_181228 = {
  name: "HPP Sepolia Testnet",
  shortName: "hpp-sepolia",
  chain: "ETH",
  icon: "hpp",
  rpc: ["https://sepolia.hpp.io"],
  faucets: ["https://faucet.conduit.xyz"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.hpp.io",
  chainId: 181228,
  networkId: 181228,
  explorers: [
    {
      name: "HPP Sepolia Explorer",
      url: "https://sepolia-explorer.hpp.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge",
      },
    ],
  },
} satisfies Chain
