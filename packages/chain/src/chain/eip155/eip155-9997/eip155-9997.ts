import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9997: Chain = {
  name: "AltLayer Testnet",
  shortName: "alt-testnet",
  chain: "ETH",
  icon: "altlayer",
  rpc: [
    "https://testnet-rollup-api.altlayer.io",
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://altlayer.io",
  chainId: 9997,
  networkId: 9997,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet-rollup-explorer.altlayer.io",
      standard: "EIP3091",
    },
  ],
}
