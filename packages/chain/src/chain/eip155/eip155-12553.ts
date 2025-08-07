/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12553 = {
  "name": "RSS3 VSL Mainnet",
  "shortName": "rss3",
  "chain": "RSS3",
  "icon": "rss3",
  "rpc": [
    "https://rpc.rss3.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "RSS3",
    "symbol": "RSS3",
    "decimals": 18
  },
  "infoURL": "https://rss3.io",
  "chainId": 12553,
  "networkId": 12553,
  "explorers": [
    {
      "name": "RSS3 VSL Scan",
      "url": "https://scan.rss3.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://explorer.rss3.io/bridge"
      }
    ]
  }
} satisfies Chain