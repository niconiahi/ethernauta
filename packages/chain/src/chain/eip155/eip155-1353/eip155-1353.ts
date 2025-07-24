/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1353 = {
  "name": "CIC Chain Mainnet",
  "shortName": "CIC",
  "chain": "CIC",
  "icon": "cicchain",
  "rpc": [
    "https://xapi.cicscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CIC",
    "decimals": 18
  },
  "infoURL": "https://www.cicchain.net",
  "chainId": 1353,
  "networkId": 1353,
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://cicscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain