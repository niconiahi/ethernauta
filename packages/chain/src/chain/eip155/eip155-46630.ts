import type { Chain } from "../shared"

export const eip155_46630 = {
  name: "Robinhood Chain Testnet",
  shortName: "rh-testnet",
  title: "Robinhood Chain Testnet",
  chain: "ETH",
  rpc: ["https://rpc.testnet.chain.robinhood.com/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.robinhood.com/chain/",
  chainId: 46630,
  networkId: 46630,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.chain.robinhood.com",
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
