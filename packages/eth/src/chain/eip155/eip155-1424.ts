/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1424 = {
  "name": "Perennial",
  "shortName": "perennial",
  "chain": "perennial",
  "icon": "perennial",
  "rpc": [
    "https://rpc.perennial.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://perennial.finance",
  "chainId": 1424,
  "networkId": 1424,
  "explorers": [
    {
      "name": "Perennial Explorer",
      "url": "https://explorer.perennial.foundation",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-8453",
    "bridges": [
      {
        "url": "https://bridge.perennial.foundation"
      }
    ]
  }
} satisfies Chain