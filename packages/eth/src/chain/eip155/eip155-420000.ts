/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_420000 = {
  "name": "Infinaeon",
  "shortName": "Infinaeon",
  "chain": "Infinaeon",
  "rpc": [
    "https://rpc.infinaeon.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "hhttps://rpc.infinaeon.com",
  "chainId": 420000,
  "networkId": 420000,
  "explorers": [
    {
      "name": "tracehawk",
      "url": "https://explorer.infinaeon.com",
      "standard": "none"
    }
  ]
} satisfies Chain