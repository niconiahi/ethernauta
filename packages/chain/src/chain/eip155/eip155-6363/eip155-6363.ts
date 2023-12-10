import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_6363: Chain = {
  name: "Digit Soul Smart Chain",
  shortName: "DGS",
  chain: "DGS",
  icon: "pnet",
  rpc: [
    "https://dsc-rpc.digitsoul.co.th",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Digit Coin",
    symbol: "DGC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 6363,
  networkId: 6363,
}
