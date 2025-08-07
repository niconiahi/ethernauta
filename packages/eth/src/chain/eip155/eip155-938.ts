/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_938 = {
  "name": "Haust Mainnet",
  "shortName": "haust",
  "title": "Haust Mainnet",
  "chain": "Haust",
  "icon": "haust",
  "rpc": [
    "https://haust-network-rpc.eu-north-2.gateway.fm"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "HAUST",
    "symbol": "HAUST",
    "decimals": 18
  },
  "infoURL": "https://haust.network/",
  "chainId": 938,
  "networkId": 938,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://haust-network-blockscout.eu-north-2.gateway.fm",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://haust-network-bridge.eu-north-2.gateway.fm"
      }
    ]
  }
} satisfies Chain