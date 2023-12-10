import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_43851: Chain = {
  name: "ZKFair Testnet",
  shortName: "ZKFair-Testnet",
  chain: "ETH",
  icon: "zkfair",
  rpc: [
    "https://testnet-rpc.zkfair.io",
  ],
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
    name: "USDC Token",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://zkfair.io",
  chainId: 43851,
  networkId: 43851,
  explorers: [
    {
      name: "ZKFair Testnet Info",
      url: "https://testnet-scan.zkfair.io",
      standard: "EIP3091",
    },
  ],
}
