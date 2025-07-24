/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4999 = {
  "name": "BlackFort Exchange Network",
  "shortName": "BXN",
  "chain": "BXN",
  "icon": "bxn",
  "rpc": [
    "https://mainnet.blackfort.network/rpc",
    "https://mainnet-1.blackfort.network/rpc",
    "https://mainnet-2.blackfort.network/rpc",
    "https://mainnet-3.blackfort.network/rpc"
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
  "infoURL": "https://blackfort.exchange",
  "chainId": 4999,
  "networkId": 4999,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.blackfort.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain