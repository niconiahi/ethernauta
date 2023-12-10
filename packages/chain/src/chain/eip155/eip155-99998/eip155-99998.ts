import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_99998: Chain = {
  name: "UB Smart Chain(testnet)",
  shortName: "usctest",
  chain: "USC",
  rpc: [
    "https://testnet.rpc.uschain.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "UBC",
    symbol: "UBC",
    decimals: 18,
  },
  infoURL: "https://www.ubchain.site",
  chainId: 99998,
  networkId: 99998,
}
