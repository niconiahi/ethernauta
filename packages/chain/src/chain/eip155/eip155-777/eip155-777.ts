import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_777: Chain = {
  name: "cheapETH",
  shortName: "cth",
  chain: "cheapETH",
  rpc: [
    "https://node.cheapeth.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "cTH",
    symbol: "cTH",
    decimals: 18,
  },
  infoURL: "https://cheapeth.org/",
  chainId: 777,
  networkId: 777,
}
