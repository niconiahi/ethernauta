/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8333 = {
  "name": "B3",
  "shortName": "b3",
  "chain": "B3",
  "icon": "b3",
  "rpc": [
    "https://mainnet-rpc.b3.fun"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://b3.fun",
  "chainId": 8333,
  "networkId": 8333,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.b3.fun",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain