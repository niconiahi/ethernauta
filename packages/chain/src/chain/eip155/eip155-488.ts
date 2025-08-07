/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_488 = {
  "name": "BlackFort Exchange Network",
  "shortName": "BXN",
  "chain": "BXN",
  "icon": "bxn",
  "rpc": [
    "https://rpc.blackfort.network/mainnet/rpc"
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
    "name": "BlackFort Token",
    "symbol": "BXN",
    "decimals": 18
  },
  "infoURL": "https://blackfort.com",
  "chainId": 488,
  "networkId": 488,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blackfortscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain