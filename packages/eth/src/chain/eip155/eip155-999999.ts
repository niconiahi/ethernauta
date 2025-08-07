/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_999999 = {
  "name": "AmChain",
  "shortName": "AMC",
  "title": "AMC",
  "chain": "AmChain",
  "icon": "amc",
  "rpc": [
    "https://node1.amchain.net"
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
    "name": "AMC",
    "symbol": "AMC",
    "decimals": 18
  },
  "infoURL": "https://hewe.io/",
  "chainId": 999999,
  "networkId": 999999,
  "explorers": [
    {
      "name": "AMCAmChain explorer",
      "url": "https://explorer.amchain.net",
      "standard": "none"
    }
  ]
} satisfies Chain