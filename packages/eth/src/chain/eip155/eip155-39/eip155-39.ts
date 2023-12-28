/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_39 = {
  "name": "U2U Solaris Mainnet",
  "shortName": "u2u",
  "chain": "u2u",
  "icon": "u2u",
  "rpc": [
    "https://rpc-mainnet.uniultra.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unicorn Ultra",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://uniultra.xyz",
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