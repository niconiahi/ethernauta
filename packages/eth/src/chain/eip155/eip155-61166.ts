/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_61166 = {
  "name": "Treasure",
  "shortName": "treasure",
  "chain": "Treasure",
  "icon": "treasure",
  "rpc": [
    "https://rpc.treasure.lol",
    "wss://rpc.treasure.lol/ws"
  ],
  "faucets": [
    "https://app.treasure.lol/chain/faucet",
    "https://thirdweb.com/treasure"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "MAGIC",
    "symbol": "MAGIC",
    "decimals": 18
  },
  "infoURL": "https://app.treasure.lol",
  "chainId": 61166,
  "networkId": 61166,
  "slip44": 1,
  "explorers": [
    {
      "name": "Treasure Block Explorer",
      "url": "https://treasurescan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://app.treasure.lol/chain/bridge"
      }
    ]
  }
} satisfies Chain