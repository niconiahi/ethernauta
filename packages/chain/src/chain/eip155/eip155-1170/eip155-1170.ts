import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1170: Chain = {
  name: "Origin Testnet",
  shortName: "auoc",
  chain: "Origin",
  icon: "origin",
  rpc: [
    "https://json-rpc.origin.uptick.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Origin",
    symbol: "UOC",
    decimals: 18,
  },
  infoURL: "https://www.uptick.network",
  chainId: 1170,
  networkId: 1170,
  explorers: [
    {
      name: "Origin Explorer",
      url: "https://evm-explorer.origin.uptick.network",
      standard: "none",
    },
  ],
}
