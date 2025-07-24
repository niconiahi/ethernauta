/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7 = {
  "name": "ThaiChain",
  "shortName": "tch",
  "chain": "TCH",
  "rpc": [
    "https://rpc.dome.cloud",
    "https://rpc.thaichain.org"
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
    "name": "ThaiChain Ether",
    "symbol": "TCH",
    "decimals": 18
  },
  "infoURL": "https://thaichain.io",
  "chainId": 7,
  "networkId": 7,
  "explorers": [
    {
      "name": "Thaichain Explorer",
      "url": "https://exp.thaichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain