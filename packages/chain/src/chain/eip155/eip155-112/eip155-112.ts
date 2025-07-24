/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_112 = {
  "name": "Coinbit Mainnet",
  "shortName": "coinbit",
  "chain": "Coinbit",
  "icon": "coinbit",
  "rpc": [
    "https://coinbit-rpc-mainnet.chain.sbcrypto.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas IDR",
    "symbol": "GIDR",
    "decimals": 18
  },
  "infoURL": "https://crypto.stockbit.com/",
  "chainId": 112,
  "networkId": 112,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coinbit-explorer.chain.sbcrypto.app",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain