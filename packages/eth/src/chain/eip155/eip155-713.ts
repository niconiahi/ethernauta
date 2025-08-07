/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_713 = {
  "name": "Vrcscan Mainnet",
  "shortName": "vrc",
  "chain": "VRC",
  "icon": "vrcscan",
  "rpc": [
    "https://rpc-mainnet-5.vrcscan.com",
    "https://rpc-mainnet-6.vrcscan.com",
    "https://rpc-mainnet-7.vrcscan.com",
    "https://rpc-mainnet-8.vrcscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VRC Chain",
    "symbol": "VRC",
    "decimals": 18
  },
  "infoURL": "https://vrccoin.com",
  "chainId": 713,
  "networkId": 713,
  "explorers": [
    {
      "name": "vrcscan",
      "url": "https://vrcscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dxbscan",
      "url": "https://dxb.vrcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain