import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1288: Chain = {
  name: "Moonrock",
  shortName: "mrock",
  chain: "MOON",
  rpc: [
    "https://rpc.api.moonrock.moonbeam.network",
    "wss://wss.api.moonrock.moonbeam.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Rocs",
    symbol: "ROC",
    decimals: 18,
  },
  infoURL: "https://docs.moonbeam.network/learn/platform/networks/overview/",
  chainId: 1288,
  networkId: 1288,
}
