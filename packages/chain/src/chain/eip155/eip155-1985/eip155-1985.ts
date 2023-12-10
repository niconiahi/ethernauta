import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1985: Chain = {
  name: "SatoshIE",
  shortName: "satoshie",
  chain: "TUSHY",
  icon: "satoshie",
  rpc: [
    "http://rpc.satosh.ie",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Tushy Token",
    symbol: "TUSHY",
    decimals: 18,
  },
  infoURL: "https://satosh.ie",
  chainId: 1985,
  networkId: 1985,
  explorers: [
    {
      name: "mainnetexplorer",
      url: "http://explore.satosh.ie",
      standard: "none",
    },
  ],
}
