/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9889 = {
  "name": "pointledger",
  "shortName": "pointledger",
  "chain": "pointledger",
  "icon": "pointledger",
  "rpc": [
    "https://rpc.pointledger.net"
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
    "name": "PLG",
    "symbol": "PLG",
    "decimals": 18
  },
  "infoURL": "https://pointledger.net",
  "chainId": 9889,
  "networkId": 9889,
  "explorers": [
    {
      "name": "pointledger Explorer",
      "url": "https://exp.pointledger.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain