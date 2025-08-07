/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_718 = {
  "name": "UXLINK ONE Mainnet",
  "shortName": "uxlink1",
  "chain": "UXLINK ONE",
  "icon": "uxlinkone",
  "rpc": [
    "https://rpc.uxlinkone.com"
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
    "name": "UXLINK",
    "symbol": "UXLINK",
    "decimals": 18
  },
  "infoURL": "https://www.uxlinkone.com",
  "chainId": 718,
  "networkId": 718,
  "explorers": [
    {
      "name": "UXLINK ONE Mainnet Explorer",
      "url": "https://sepolia.uxlinkone.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain