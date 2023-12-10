import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8086: Chain = {
  name: "BitEth",
  shortName: "BitEth",
  chain: "BTE",
  rpc: [
    "https://rpc.biteth.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BitEth",
    symbol: "BTE",
    decimals: 18,
  },
  infoURL: "https://biteth.org",
  chainId: 8086,
  networkId: 8086,
  explorers: [],
}
