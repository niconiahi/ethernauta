/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2241 = {
  "name": "Krest Network",
  "shortName": "KRST",
  "chain": "Krest",
  "icon": "krest",
  "rpc": [
    "https://erpc-krest.peaq.network",
    "https://krest.unitedbloc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Krest",
    "symbol": "KRST",
    "decimals": 18
  },
  "infoURL": "https://www.peaq.network",
  "chainId": 2241,
  "networkId": 2241,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wss-krest.peaq.network#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://krest.subscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain