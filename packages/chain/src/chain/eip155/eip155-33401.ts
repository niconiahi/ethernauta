/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33401 = {
  "name": "SlingShot",
  "shortName": "slingshot",
  "chain": "SLING",
  "icon": "slingshot",
  "rpc": [
    "https://rpc.slingshotdao.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Sling",
    "symbol": "SLING",
    "decimals": 18
  },
  "infoURL": "https://slingshotdao.com",
  "chainId": 33401,
  "networkId": 33401,
  "explorers": [
    {
      "name": "SlingShot Explorer",
      "url": "https://explore.slingshotdao.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain