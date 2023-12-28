/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_786 = {
  "name": "MAAL Chain",
  "shortName": "maal",
  "chain": "MAAL",
  "icon": "maal",
  "rpc": [
    "https://node1-mainnet.maalscan.io/",
    "https://node2-mainnet.maalscan.io/",
    "https://node3-mainnet.maalscan.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "infoURL": "https://www.maalchain.com/",
  "chainId": 786,
  "networkId": 786,
  "explorers": [
    {
      "name": "maalscan",
      "url": "https://maalscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain