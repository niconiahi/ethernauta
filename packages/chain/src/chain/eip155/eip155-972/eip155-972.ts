/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_972 = {
  "name": "Oort Ascraeus",
  "shortName": "Ascraeus",
  "title": "Oort Ascraeus",
  "chain": "Ascraeus",
  "icon": "oort",
  "rpc": [
    "https://ascraeus-rpc.oortech.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCNA",
    "decimals": 18
  },
  "infoURL": "https://oortech.com",
  "chainId": 972,
  "networkId": 972,
  "explorers": [
    {
      "name": "Oort Ascraeus Explorer",
      "url": "https://ascraeus-scan.oortech.com",
      "standard": "none"
    }
  ]
} satisfies Chain