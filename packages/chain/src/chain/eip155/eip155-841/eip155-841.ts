import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_841: Chain = {
  name: "Taraxa Mainnet",
  shortName: "tara",
  chain: "Tara",
  icon: "taraxa",
  rpc: [
    "https://rpc.mainnet.taraxa.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Tara",
    symbol: "TARA",
    decimals: 18,
  },
  infoURL: "https://taraxa.io",
  chainId: 841,
  networkId: 841,
  explorers: [
    {
      name: "Taraxa Explorer",
      url: "https://explorer.mainnet.taraxa.io",
      standard: "none",
    },
  ],
}
