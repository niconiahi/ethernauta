/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1911 = {
  "name": "Scalind",
  "shortName": "scal",
  "chain": "ETH",
  "icon": "scalind",
  "rpc": [
    "https://rpc.scalind.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scalind.com",
  "chainId": 1911,
  "networkId": 1911,
  "explorers": [
    {
      "name": "scalind",
      "url": "https://explorer.scalind.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain