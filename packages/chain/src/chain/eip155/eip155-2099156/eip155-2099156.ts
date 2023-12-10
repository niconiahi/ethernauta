import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2099156: Chain = {
  name: "Plian Mainnet Main",
  shortName: "plian-mainnet",
  chain: "Plian",
  rpc: [
    "https://mainnet.plian.io/pchain",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Plian Token",
    symbol: "PI",
    decimals: 18,
  },
  infoURL: "https://plian.org/",
  chainId: 2099156,
  networkId: 2099156,
  explorers: [
    {
      name: "piscan",
      url: "https://piscan.plian.org/pchain",
      standard: "EIP3091",
    },
  ],
}
