/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_75000 = {
  "name": "ResinCoin Mainnet",
  "shortName": "resin",
  "chain": "RESIN",
  "icon": "resincoin",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "RESIN",
    "decimals": 18
  },
  "infoURL": "https://resincoin.dev",
  "chainId": 75000,
  "networkId": 75000,
  "explorers": [
    {
      "name": "ResinScan",
      "url": "https://explorer.resincoin.dev",
      "standard": "none"
    }
  ]
} satisfies Chain