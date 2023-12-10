import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3000: Chain = {
  name: "CENNZnet Rata",
  shortName: "cennz-r",
  chain: "CENNZnet",
  icon: "cennz",
  rpc: [],
  faucets: [
    "https://app-faucet.centrality.me",
  ],
  nativeCurrency: {
    name: "CPAY",
    symbol: "CPAY",
    decimals: 18,
  },
  infoURL: "https://cennz.net",
  chainId: 3000,
  networkId: 3000,
}
