import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2357: Chain = {
  name: "(deprecated) Kroma Sepolia",
  shortName: "deprecated-kroma-sepolia",
  title: "(deprecated) Kroma Testnet Sepolia",
  chain: "ETH",
  icon: "kroma",
  rpc: [
    "https://api.sepolia-deprecated.kroma.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://kroma.network",
  chainId: 2357,
  networkId: 2357,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.sepolia-deprecated.kroma.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://kroma.network/bridge",
      },
    ],
  },
  status: "deprecated",
}
