/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_970 = {
  "name": "Oort Mainnet",
  "shortName": "ccn",
  "chain": "Oort Mainnet",
  "icon": "oort",
  "rpc": [
    "https://mainnet-rpc.oortech.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "infoURL": "https://oortech.com",
  "chainId": 970,
  "networkId": 970,
  "explorers": [
    {
      "name": "Oort Mainnet Explorer",
      "url": "https://mainnet-scan.oortech.com",
      "standard": "none"
    }
  ]
} satisfies Chain