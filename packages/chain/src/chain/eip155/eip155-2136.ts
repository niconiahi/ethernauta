/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2136 = {
  "name": "BigShortBets Testnet",
  "shortName": "bigsb_testnet",
  "chain": "BIGSB Testnet",
  "rpc": [
    "https://test-market.bigsb.network",
    "wss://test-market.bigsb.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dolarz",
    "symbol": "Dolarz",
    "decimals": 18
  },
  "infoURL": "https://bigshortbets.com/",
  "chainId": 2136,
  "networkId": 2136,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://test-market.bigsb.network#/explorer",
      "standard": "none"
    }
  ]
} satisfies Chain