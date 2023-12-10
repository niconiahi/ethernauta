import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_16000: Chain = {
  name: "MetaDot Mainnet",
  shortName: "mtt",
  chain: "MTT",
  rpc: [
    "https://mainnet.metadot.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MetaDot Token",
    symbol: "MTT",
    decimals: 18,
  },
  infoURL: "https://metadot.network",
  chainId: 16000,
  networkId: 16000,
}
