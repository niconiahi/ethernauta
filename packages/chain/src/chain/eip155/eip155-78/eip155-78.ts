import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_78: Chain = {
  name: "PrimusChain mainnet",
  shortName: "primuschain",
  chain: "PC",
  rpc: [
    "https://ethnode.primusmoney.com/mainnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Primus Ether",
    symbol: "PETH",
    decimals: 18,
  },
  infoURL: "https://primusmoney.com",
  chainId: 78,
  networkId: 78,
}
