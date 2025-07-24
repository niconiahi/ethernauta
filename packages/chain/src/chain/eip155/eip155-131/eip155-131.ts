/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_131 = {
  "name": "Engram Testnet",
  "shortName": "tgram",
  "chain": "tGRAM",
  "icon": "engram",
  "rpc": [
    "https://tokioswift.engram.tech",
    "https://tokio-archive.engram.tech"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Engram Tokio Testnet",
    "symbol": "tGRAM",
    "decimals": 18
  },
  "infoURL": "https://engramnet.io",
  "chainId": 131,
  "networkId": 131,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://tokioscan-v2.engram.tech",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain