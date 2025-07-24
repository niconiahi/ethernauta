/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_719 = {
  "name": "Shibarium Beta",
  "shortName": "shibarium",
  "chain": "Shibarium",
  "icon": "shibarium",
  "rpc": [
    "https://puppynet.shibrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://beta.shibariumtech.com",
  "chainId": 719,
  "networkId": 719,
  "explorers": [
    {
      "name": "shibscan",
      "url": "https://puppyscan.shib.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain