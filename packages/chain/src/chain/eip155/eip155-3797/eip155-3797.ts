import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3797: Chain = {
  name: "AlveyChain Mainnet",
  shortName: "alv",
  chain: "ALV",
  icon: "alveychain",
  rpc: [
    "https://rpc.alveychain.com/rpc",
    "https://rpc2.alvey.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "AlveyCoin",
    symbol: "ALV",
    decimals: 18,
  },
  infoURL: "https://alveyscan.com/rpc",
  chainId: 3797,
  networkId: 3797,
  explorers: [
    {
      name: "AlveyScan",
      url: "https://alveyscan.com",
      standard: "EIP3091",
    },
  ],
}
