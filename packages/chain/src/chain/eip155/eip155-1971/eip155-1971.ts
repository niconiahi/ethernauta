import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1971: Chain = {
  name: "Atelier",
  shortName: "atlr",
  title: "Atelier Test Network",
  chain: "ALTR",
  icon: "atlr",
  rpc: [
    "https://1971.network/atlr",
    "wss://1971.network/atlr",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ATLR",
    symbol: "ATLR",
    decimals: 18,
  },
  infoURL: "https://1971.network/",
  chainId: 1971,
  networkId: 1971,
}
