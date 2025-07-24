/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_721 = {
  "name": "Lycan Chain",
  "shortName": "LYC",
  "chain": "LYC",
  "icon": "lycanchain",
  "rpc": [
    "https://rpc.lycanchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lycan",
    "symbol": "LYC",
    "decimals": 18
  },
  "infoURL": "https://lycanchain.com",
  "chainId": 721,
  "networkId": 721,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.lycanchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain