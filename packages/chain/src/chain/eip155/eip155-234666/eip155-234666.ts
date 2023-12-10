import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_234666: Chain = {
  name: "Haymo Testnet",
  shortName: "hym",
  chain: "tHYM",
  rpc: [
    "https://testnet1.haymo.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "HAYMO",
    symbol: "HYM",
    decimals: 18,
  },
  infoURL: "https://haymoswap.web.app/",
  chainId: 234666,
  networkId: 234666,
}
