import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_163: Chain = {
  name: "Lightstreams Mainnet",
  shortName: "pht",
  chain: "PHT",
  rpc: [
    "https://node.mainnet.lightstreams.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Lightstreams PHT",
    symbol: "PHT",
    decimals: 18,
  },
  infoURL: "https://explorer.lightstreams.io",
  chainId: 163,
  networkId: 163,
}
