import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1140: Chain = {
  name: "MathChain Testnet",
  shortName: "tMATH",
  chain: "MATH",
  rpc: [
    "https://galois-hk.maiziqianbao.net/rpc",
  ],
  faucets: [
    "https://scan.boka.network/#/Galois/faucet",
  ],
  nativeCurrency: {
    name: "MathChain",
    symbol: "MATH",
    decimals: 18,
  },
  infoURL: "https://mathchain.org",
  chainId: 1140,
  networkId: 1140,
}
