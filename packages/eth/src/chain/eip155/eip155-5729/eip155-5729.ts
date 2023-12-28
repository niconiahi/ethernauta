/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5729 = {
  "name": "Hika Network Testnet",
  "shortName": "hik",
  "title": "Hika Network Testnet",
  "chain": "HIK",
  "icon": "hik",
  "rpc": [
    "https://rpc-testnet.hika.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hik Token",
    "symbol": "HIK",
    "decimals": 18
  },
  "infoURL": "https://hika.network/",
  "chainId": 5729,
  "networkId": 5729,
  "explorers": [
    {
      "name": "Hika Network Testnet Explorer",
      "url": "https://scan-testnet.hika.network",
      "standard": "none"
    }
  ]
} satisfies Chain