/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_22052002 = {
  "name": "Excelon Mainnet",
  "shortName": "xlon",
  "chain": "XLON",
  "icon": "xlon",
  "rpc": [
    "https://edgewallet1.xlon.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Excelon",
    "symbol": "xlon",
    "decimals": 18
  },
  "infoURL": "https://xlon.org",
  "chainId": 22052002,
  "networkId": 22052002,
  "explorers": [
    {
      "name": "Excelon explorer",
      "url": "https://explorer.excelon.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain