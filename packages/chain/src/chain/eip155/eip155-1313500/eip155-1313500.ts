import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1313500: Chain = {
  name: "Xerom",
  shortName: "xero",
  chain: "XERO",
  rpc: [
    "https://rpc.xerom.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Xerom Ether",
    symbol: "XERO",
    decimals: 18,
  },
  infoURL: "https://xerom.org",
  chainId: 1313500,
  networkId: 1313500,
}
