import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1620: Chain = {
  name: "Atheios",
  shortName: "ath",
  chain: "ATH",
  rpc: [
    "https://rpc.atheios.org/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Atheios Ether",
    symbol: "ATH",
    decimals: 18,
  },
  infoURL: "https://atheios.org",
  chainId: 1620,
  networkId: 11235813,
  slip44: 1620,
}
