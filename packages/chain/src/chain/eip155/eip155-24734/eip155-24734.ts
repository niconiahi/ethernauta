import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_24734: Chain = {
  name: "MintMe.com Coin",
  shortName: "mintme",
  chain: "MINTME",
  rpc: [
    "https://node1.mintme.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MintMe.com Coin",
    symbol: "MINTME",
    decimals: 18,
  },
  infoURL: "https://www.mintme.com",
  chainId: 24734,
  networkId: 37480,
}
