import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_127: Chain = {
  name: "Factory 127 Mainnet",
  shortName: "feth",
  chain: "FETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Factory 127 Token",
    symbol: "FETH",
    decimals: 18,
  },
  infoURL: "https://www.factory127.com",
  chainId: 127,
  networkId: 127,
  slip44: 127,
}
