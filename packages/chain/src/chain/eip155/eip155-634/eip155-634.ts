import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_634: Chain = {
  name: "Avocado",
  shortName: "avocado",
  chain: "Avocado",
  icon: "avocado",
  rpc: [
    "https://rpc.avocado.instadapp.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://avocado.instadapp.io",
  chainId: 634,
  networkId: 634,
  explorers: [
    {
      name: "avoscan",
      url: "https://avoscan.co",
      standard: "none",
    },
  ],
}
