import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_67: Chain = {
  name: "DBChain Testnet",
  shortName: "dbm",
  chain: "DBM",
  rpc: [
    "http://test-rpc.dbmbp.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DBChain Testnet",
    symbol: "DBM",
    decimals: 18,
  },
  infoURL: "http://test.dbmbp.com",
  chainId: 67,
  networkId: 67,
}
