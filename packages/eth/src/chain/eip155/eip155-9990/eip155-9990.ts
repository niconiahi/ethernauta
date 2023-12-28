/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9990 = {
  "name": "Agung Network",
  "shortName": "AGNG",
  "chain": "Agung",
  "icon": "agung",
  "rpc": [
    "https://rpcpc1-qa.agung.peaq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Agung",
    "symbol": "AGNG",
    "decimals": 18
  },
  "infoURL": "https://www.peaq.network",
  "chainId": 9990,
  "networkId": 9990,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wsspc1-qa.agung.peaq.network#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://agung.subscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain