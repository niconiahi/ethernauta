import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_6118: Chain = {
  name: "UPTN Testnet",
  shortName: "UPTN-TEST",
  chain: "UPTN",
  icon: "uptn",
  rpc: [
    "https://node-api.alp.uptn.io/v1/ext/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "UPTN",
    symbol: "UPTN",
    decimals: 18,
  },
  infoURL: "https://uptn.io",
  chainId: 6118,
  networkId: 6118,
  explorers: [
    {
      name: "UPTN Testnet Explorer",
      url: "https://testnet.explorer.uptn.io",
      standard: "EIP3091",
    },
  ],
}
