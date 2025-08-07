/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_91120 = {
  "name": "MetaDAP Enterprise Mainnet",
  "shortName": "MetaDAP",
  "title": "MetaDAP Enterprise Mainnet",
  "chain": "MetaDAP",
  "icon": "metadap",
  "rpc": [
    "https://rpc.chain.metadap.io",
    "wss://rpc-ws.chain.metadap.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DAP",
    "symbol": "DAP",
    "decimals": 18
  },
  "infoURL": "https://metadap.io/",
  "chainId": 91120,
  "networkId": 91120,
  "explorers": [
    {
      "name": "MetaDAP Enterprise Mainnet explorer",
      "url": "https://explorer.chain.metadap.io",
      "standard": "none"
    }
  ]
} satisfies Chain