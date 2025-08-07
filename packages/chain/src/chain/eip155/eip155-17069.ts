/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_17069 = {
  "name": "Garnet Holesky",
  "shortName": "garnet",
  "chain": "ETH",
  "icon": "garnet",
  "rpc": [
    "https://rpc.garnetchain.com",
    "wss://rpc.garnetchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://redstone.xyz",
  "chainId": 17069,
  "networkId": 17069,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.garnetchain.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-17000",
    "bridges": [
      {
        "url": "https://garnetchain.com/deposit"
      }
    ]
  }
} satisfies Chain