import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3270: Chain = {
  name: "Dubxcoin testnet",
  shortName: "testdubx",
  chain: "TESTDUBX",
  rpc: [
    "https://rpctestnet.arabianchain.org",
  ],
  faucets: [
    "https://faucet.arabianchain.org/",
  ],
  nativeCurrency: {
    name: "Dubxcoin testnet",
    symbol: "TDUBX",
    decimals: 18,
  },
  infoURL: "https://arabianchain.org",
  chainId: 3270,
  networkId: 3270,
}
