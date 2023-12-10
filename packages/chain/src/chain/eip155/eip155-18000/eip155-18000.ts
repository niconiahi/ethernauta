import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_18000: Chain = {
  name: "Frontier of Dreams Testnet",
  shortName: "ZKST",
  chain: "Game Network",
  rpc: [
    "https://rpc.fod.games/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ZKST",
    symbol: "ZKST",
    decimals: 18,
  },
  infoURL: "https://goexosphere.com",
  chainId: 18000,
  networkId: 18000,
  explorers: [
    {
      name: "Game Network",
      url: "https://explorer.fod.games",
      standard: "EIP3091",
    },
  ],
}
