import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_111: Chain = {
  name: "EtherLite Chain",
  shortName: "ETL",
  chain: "ETL",
  icon: "etherlite",
  rpc: [
    "https://rpc.etherlite.org",
  ],
  faucets: [
    "https://etherlite.org/faucets",
  ],
  nativeCurrency: {
    name: "EtherLite",
    symbol: "ETL",
    decimals: 18,
  },
  infoURL: "https://etherlite.org",
  chainId: 111,
  networkId: 111,
}
