import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_41500: Chain = {
  name: "Opulent-X BETA",
  shortName: "ox-beta",
  chain: "Opulent-X",
  rpc: [
    "https://connect.opulent-x.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Oxyn Gas",
    symbol: "OXYN",
    decimals: 18,
  },
  infoURL: "https://beta.opulent-x.com",
  chainId: 41500,
  networkId: 41500,
  explorers: [
    {
      name: "Opulent-X BETA Explorer",
      url: "https://explorer.opulent-x.com",
      standard: "none",
    },
  ],
}
