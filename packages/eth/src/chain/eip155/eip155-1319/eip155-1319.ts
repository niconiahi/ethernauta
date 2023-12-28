/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1319 = {
  "name": "AIA Mainnet",
  "shortName": "aia",
  "chain": "AIA",
  "icon": "aia",
  "rpc": [
    "https://aia-dataseed1.aiachain.org",
    "https://aia-dataseed2.aiachain.org",
    "https://aia-dataseed3.aiachain.org",
    "https://aia-dataseed4.aiachain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AIA Mainnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "infoURL": "https://aiachain.org/",
  "chainId": 1319,
  "networkId": 1319,
  "explorers": [
    {
      "name": "AIA Chain Explorer Mainnet",
      "url": "https://aiascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain