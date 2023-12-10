import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_31102: Chain = {
  name: "Ethersocial Network",
  shortName: "esn",
  chain: "ESN",
  rpc: [
    "https://api.esn.gonspool.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ethersocial Network Ether",
    symbol: "ESN",
    decimals: 18,
  },
  infoURL: "https://ethersocial.org",
  chainId: 31102,
  networkId: 1,
  slip44: 31102,
}
