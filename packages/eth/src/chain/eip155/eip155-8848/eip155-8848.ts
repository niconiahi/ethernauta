/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8848 = {
  "name": "MARO Blockchain Mainnet",
  "shortName": "maro",
  "chain": "MARO Blockchain",
  "icon": "MARO",
  "rpc": [
    "https://rpc-mainnet.ma.ro"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MARO",
    "symbol": "MARO",
    "decimals": 18
  },
  "infoURL": "https://ma.ro/",
  "chainId": 8848,
  "networkId": 8848,
  "explorers": [
    {
      "name": "MARO Scan",
      "url": "https://scan.ma.ro/#",
      "standard": "none"
    }
  ]
} satisfies Chain