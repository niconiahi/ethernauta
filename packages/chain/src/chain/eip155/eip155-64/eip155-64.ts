import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_64: Chain = {
  name: "Ellaism",
  shortName: "ellaism",
  chain: "ELLA",
  rpc: [
    "https://jsonrpc.ellaism.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ellaism Ether",
    symbol: "ELLA",
    decimals: 18,
  },
  infoURL: "https://ellaism.org",
  chainId: 64,
  networkId: 64,
  slip44: 163,
}
