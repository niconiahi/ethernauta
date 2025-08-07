/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4888 = {
  "name": "BlackFort Exchange Network Testnet",
  "shortName": "BXNT",
  "chain": "BXNT",
  "icon": "bxn",
  "rpc": [
    "https://rpc.blackfort.network/testnet/rpc"
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
    "name": "BlackFort Testnet Token",
    "symbol": "BXNT",
    "decimals": 18
  },
  "infoURL": "https://blackfort.com",
  "chainId": 4888,
  "networkId": 4888,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.blackfortscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain