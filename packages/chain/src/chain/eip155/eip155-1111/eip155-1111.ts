import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1111: Chain = {
  name: "WEMIX3.0 Mainnet",
  shortName: "wemix",
  chain: "WEMIX",
  rpc: [
    "https://api.wemix.com",
    "wss://ws.wemix.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "WEMIX",
    symbol: "WEMIX",
    decimals: 18,
  },
  infoURL: "https://wemix.com",
  chainId: 1111,
  networkId: 1111,
  explorers: [
    {
      name: "WEMIX Block Explorer",
      url: "https://explorer.wemix.com",
      standard: "EIP3091",
    },
  ],
}
