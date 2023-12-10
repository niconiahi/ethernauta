import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_821: Chain = {
  name: "Callisto Testnet Deprecated",
  shortName: "tclo",
  chain: "CLO",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Callisto Testnet Ether",
    symbol: "TCLO",
    decimals: 18,
  },
  infoURL: "https://callisto.network",
  chainId: 821,
  networkId: 2,
  status: "deprecated",
}
