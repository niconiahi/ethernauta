import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_6: Chain = {
  name: "Ethereum Classic Testnet Kotti",
  shortName: "kot",
  chain: "ETC",
  rpc: [
    "https://www.ethercluster.com/kotti",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Kotti Ether",
    symbol: "KOT",
    decimals: 18,
  },
  infoURL: "https://explorer.jade.builders/?network=kotti",
  chainId: 6,
  networkId: 6,
  status: "deprecated",
}
