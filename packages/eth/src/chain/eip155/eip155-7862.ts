/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7862 = {
  "name": "MaalChain V2",
  "shortName": "maal-v2",
  "chain": "MAAL",
  "icon": "maal",
  "rpc": [
    "https://node1-mainnet-new.maalscan.io/",
    "https://node2-mainnet-new.maalscan.io/",
    "https://node3-mainnet-new.maalscan.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "infoURL": "https://www.maalchain.com/",
  "chainId": 7862,
  "networkId": 7862,
  "explorers": [
    {
      "name": "maalscan",
      "url": "https://v2.maalscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain