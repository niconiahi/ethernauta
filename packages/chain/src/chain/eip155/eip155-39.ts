/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_39 = {
  "name": "U2U Solaris Mainnet",
  "shortName": "u2u",
  "chain": "u2u",
  "icon": "u2u",
  "rpc": [
    "https://rpc-mainnet.u2u.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "U2U Network",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://u2u.xyz",
  "chainId": 39,
  "networkId": 39,
  "explorers": [
    {
      "name": "U2U Explorer",
      "url": "https://u2uscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain