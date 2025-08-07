/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_50000 = {
  "name": "Citronus",
  "shortName": "citro",
  "chain": "Citronus",
  "icon": "citro",
  "rpc": [
    "https://rpc.citronus.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CITRO",
    "symbol": "CITRO",
    "decimals": 18
  },
  "infoURL": "https://citronus.com",
  "chainId": 50000,
  "networkId": 50000,
  "explorers": [
    {
      "name": "citro",
      "url": "https://explorer.citronus.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/citronus"
      }
    ]
  }
} satisfies Chain