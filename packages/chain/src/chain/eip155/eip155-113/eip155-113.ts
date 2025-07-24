/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_113 = {
  "name": "Dehvo",
  "shortName": "deh",
  "chain": "Dehvo",
  "rpc": [
    "https://connect.dehvo.com",
    "https://rpc.dehvo.com",
    "https://rpc1.dehvo.com",
    "https://rpc2.dehvo.com"
  ],
  "faucets": [
    "https://buy.dehvo.com"
  ],
  "nativeCurrency": {
    "name": "Dehvo",
    "symbol": "Deh",
    "decimals": 18
  },
  "infoURL": "https://dehvo.com",
  "chainId": 113,
  "networkId": 113,
  "slip44": 714,
  "explorers": [
    {
      "name": "Dehvo Explorer",
      "url": "https://explorer.dehvo.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain