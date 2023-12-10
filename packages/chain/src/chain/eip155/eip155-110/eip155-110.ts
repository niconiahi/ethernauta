import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_110: Chain = {
  name: "Proton Testnet",
  shortName: "xpr",
  chain: "XPR",
  rpc: [
    "https://protontestnet.greymass.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Proton",
    symbol: "XPR",
    decimals: 4,
  },
  infoURL: "https://protonchain.com",
  chainId: 110,
  networkId: 110,
}
