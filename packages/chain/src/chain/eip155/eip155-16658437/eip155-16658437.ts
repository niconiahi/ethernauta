import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_16658437: Chain = {
  name: "Plian Testnet Main",
  shortName: "plian-testnet",
  chain: "Plian",
  rpc: [
    "https://testnet.plian.io/testnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Plian Testnet Token",
    symbol: "TPI",
    decimals: 18,
  },
  infoURL: "https://plian.org",
  chainId: 16658437,
  networkId: 16658437,
  explorers: [
    {
      name: "piscan",
      url: "https://testnet.plian.org/testnet",
      standard: "EIP3091",
    },
  ],
}
