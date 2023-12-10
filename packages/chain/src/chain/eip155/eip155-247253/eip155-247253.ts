import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_247253: Chain = {
  name: "Saakuru Testnet",
  shortName: "saakuru-testnet",
  chain: "Saakuru",
  icon: "saakuru",
  rpc: [
    "https://rpc-testnet.saakuru.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://saakuru.network",
  chainId: 247253,
  networkId: 247253,
  explorers: [
    {
      name: "saakuru-explorer-testnet",
      url: "https://explorer-testnet.saakuru.network",
      standard: "EIP3091",
    },
  ],
}
