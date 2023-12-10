import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1004: Chain = {
  name: "T-EKTA",
  shortName: "t-ekta",
  title: "EKTA Testnet T-EKTA",
  chain: "T-EKTA",
  icon: "ekta",
  rpc: [
    "https://test.ekta.io:8545",
  ],
  faucets: [],
  nativeCurrency: {
    name: "T-EKTA",
    symbol: "T-EKTA",
    decimals: 18,
  },
  infoURL: "https://www.ekta.io",
  chainId: 1004,
  networkId: 1004,
  explorers: [
    {
      name: "test-ektascan",
      url: "https://test.ektascan.io",
      standard: "EIP3091",
    },
  ],
}
