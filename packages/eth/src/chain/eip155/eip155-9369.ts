/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9369 = {
  "name": "Z Chain",
  "shortName": "z",
  "title": "Z Chain",
  "chain": "Z",
  "icon": "z",
  "rpc": [
    "https://rpc.zchain.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Z",
    "symbol": "Z",
    "decimals": 18
  },
  "infoURL": "https://zero.tech",
  "chainId": 9369,
  "networkId": 9369,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zscan.live",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "bridge.zchain.org"
      }
    ]
  }
} satisfies Chain