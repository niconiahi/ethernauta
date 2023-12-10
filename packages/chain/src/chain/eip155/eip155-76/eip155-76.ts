import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_76: Chain = {
  name: "Mix",
  shortName: "mix",
  chain: "MIX",
  rpc: [
    "https://rpc2.mix-blockchain.org:8647",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Mix Ether",
    symbol: "MIX",
    decimals: 18,
  },
  infoURL: "https://mix-blockchain.org",
  chainId: 76,
  networkId: 76,
  slip44: 76,
}
