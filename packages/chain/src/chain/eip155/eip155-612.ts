/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_612 = {
  "name": "EIOB Mainnet",
  "shortName": "eiob",
  "chain": "EIOB",
  "icon": "eiob",
  "rpc": [
    "https://rpc.eiob.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EIOB",
    "symbol": "EIOB",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 612,
  "networkId": 612,
  "explorers": [
    {
      "name": "EIOB Explorer",
      "url": "https://explorer.eiob.xyz",
      "standard": "none"
    }
  ]
} satisfies Chain