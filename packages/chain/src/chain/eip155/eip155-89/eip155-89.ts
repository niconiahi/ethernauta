import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_89: Chain = {
  name: "TomoChain Testnet",
  shortName: "tomot",
  chain: "TOMO",
  rpc: [
    "https://rpc.testnet.tomochain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TomoChain",
    symbol: "TOMO",
    decimals: 18,
  },
  infoURL: "https://tomochain.com",
  chainId: 89,
  networkId: 89,
  slip44: 889,
}
