/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_39815 = {
  "name": "OHO Mainnet",
  "shortName": "oho",
  "chain": "OHO",
  "icon": "oho",
  "rpc": [
    "https://mainnet.oho.ai"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OHO",
    "symbol": "OHO",
    "decimals": 18
  },
  "infoURL": "https://oho.ai",
  "chainId": 39815,
  "networkId": 39815,
  "explorers": [
    {
      "name": "ohoscan",
      "url": "https://ohoscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain