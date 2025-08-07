/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_191919 = {
  "name": "Altblockscan Mainnet",
  "shortName": "altb",
  "chain": "ALTB",
  "icon": "altb",
  "rpc": [
    "https://rpc.altblockscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Altblockscan",
    "symbol": "ALTB",
    "decimals": 18
  },
  "infoURL": "https://altblockscan.com",
  "chainId": 191919,
  "networkId": 191919,
  "explorers": [
    {
      "name": "altblockscan",
      "url": "https://scan.altblockscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain