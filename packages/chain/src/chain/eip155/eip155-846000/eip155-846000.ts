import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_846000: Chain = {
  name: "4GoodNetwork",
  shortName: "bloqs4good",
  chain: "4GN",
  rpc: [
    "https://chain.deptofgood.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "APTA",
    symbol: "APTA",
    decimals: 18,
  },
  infoURL: "https://bloqs4good.com",
  chainId: 846000,
  networkId: 846000,
}
