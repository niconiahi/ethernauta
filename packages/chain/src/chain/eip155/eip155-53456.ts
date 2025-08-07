/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_53456 = {
  "name": "BirdLayer",
  "shortName": "birdlayer",
  "title": "BirdLayer",
  "chain": "BirdLayer",
  "icon": "birdlayer",
  "rpc": [
    "https://rpc.birdlayer.xyz",
    "https://rpc1.birdlayer.xyz",
    "wss://rpc.birdlayer.xyz/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.dodochain.com",
  "chainId": 53456,
  "networkId": 53456,
  "explorers": [
    {
      "name": "BirdLayer Explorer",
      "url": "https://scan.birdlayer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain