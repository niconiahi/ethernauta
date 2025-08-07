/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7233 = {
  "name": "InitVerse Mainnet",
  "shortName": "INI",
  "chain": "InitVerse",
  "icon": "initverse",
  "rpc": [
    "https://rpc-mainnet.inichain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "InitVerse",
    "symbol": "INI",
    "decimals": 18
  },
  "infoURL": "https://www.inichain.com",
  "chainId": 7233,
  "networkId": 7233,
  "explorers": [
    {
      "name": "initverse",
      "url": "https://www.iniscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain