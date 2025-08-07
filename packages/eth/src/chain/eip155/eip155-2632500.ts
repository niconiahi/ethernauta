/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2632500 = {
  "name": "COTI",
  "shortName": "coti",
  "chain": "COTI",
  "icon": "coti",
  "rpc": [
    "https://mainnet.coti.io/rpc"
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
    "name": "COTI",
    "symbol": "COTI",
    "decimals": 18
  },
  "infoURL": "https://coti.io/",
  "chainId": 2632500,
  "networkId": 2632500,
  "explorers": [
    {
      "name": "COTI Mainnet Explorer",
      "url": "https://mainnet.cotiscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain