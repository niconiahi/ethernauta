import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_12: Chain = {
  name: "Metadium Testnet",
  shortName: "kal",
  chain: "META",
  rpc: [
    "https://api.metadium.com/dev",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Metadium Testnet Ether",
    symbol: "KAL",
    decimals: 18,
  },
  infoURL: "https://metadium.com",
  chainId: 12,
  networkId: 12,
}
