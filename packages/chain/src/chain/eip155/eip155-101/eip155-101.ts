import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_101: Chain = {
  name: "EtherInc",
  shortName: "eti",
  chain: "ETI",
  rpc: [
    "https://api.einc.io/jsonrpc/mainnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EtherInc Ether",
    symbol: "ETI",
    decimals: 18,
  },
  infoURL: "https://einc.io",
  chainId: 101,
  networkId: 1,
  slip44: 464,
}
