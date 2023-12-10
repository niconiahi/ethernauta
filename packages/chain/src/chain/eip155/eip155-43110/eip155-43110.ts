import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_43110: Chain = {
  name: "Athereum",
  shortName: "avaeth",
  chain: "ATH",
  rpc: [
    "https://ava.network:21015/ext/evm/rpc",
  ],
  faucets: [
    "http://athfaucet.ava.network//?address=${ADDRESS}",
  ],
  nativeCurrency: {
    name: "Athereum Ether",
    symbol: "ATH",
    decimals: 18,
  },
  infoURL: "https://athereum.ava.network",
  chainId: 43110,
  networkId: 43110,
}
