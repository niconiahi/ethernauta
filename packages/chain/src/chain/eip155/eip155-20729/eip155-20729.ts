import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_20729: Chain = {
  name: "Callisto Testnet",
  shortName: "CLOTestnet",
  chain: "CLO",
  rpc: [
    "https://testnet-rpc.callisto.network/",
  ],
  faucets: [
    "https://faucet.callisto.network/",
  ],
  nativeCurrency: {
    name: "Callisto",
    symbol: "CLO",
    decimals: 18,
  },
  infoURL: "https://callisto.network",
  chainId: 20729,
  networkId: 79,
}
