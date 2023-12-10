import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8654: Chain = {
  name: "Toki Network",
  shortName: "toki",
  chain: "TOKI",
  icon: "toki",
  rpc: [
    "https://mainnet.buildwithtoki.com/v0/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Toki",
    symbol: "TOKI",
    decimals: 18,
  },
  infoURL: "https://www.buildwithtoki.com",
  chainId: 8654,
  networkId: 8654,
  explorers: [],
}
