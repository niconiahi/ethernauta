import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_421614: Chain = {
  name: "Arbitrum Sepolia",
  shortName: "arb-sep",
  title: "Arbitrum Sepolia Rollup Testnet",
  chain: "ETH",
  rpc: [
    "https://sepolia-rollup.arbitrum.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://arbitrum.io",
  chainId: 421614,
  networkId: 421614,
  explorers: [
    {
      name: "Arbitrum Sepolia Rollup Testnet Explorer",
      url: "https://sepolia-explorer.arbitrum.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.arbitrum.io",
      },
    ],
  },
}
