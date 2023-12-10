import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8655: Chain = {
  name: "Toki Testnet",
  shortName: "toki-testnet",
  chain: "TOKI",
  icon: "toki",
  rpc: [
    "https://testnet.buildwithtoki.com/v0/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Toki",
    symbol: "TOKI",
    decimals: 18,
  },
  infoURL: "https://www.buildwithtoki.com",
  chainId: 8655,
  networkId: 8655,
  explorers: [],
}
