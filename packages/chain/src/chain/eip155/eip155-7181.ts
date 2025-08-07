/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7181 = {
  "name": "UXLINK One Testnet",
  "shortName": "uxlink1-sep",
  "chain": "UXLINK One",
  "icon": "uxlinkone",
  "rpc": [
    "https://rpc-sepolia.uxlinkone.com"
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
  "infoURL": "https://www.uxlinkone.io",
  "chainId": 7181,
  "networkId": 7181,
  "explorers": [
    {
      "name": "UXLINK One Sepolia Explorer",
      "url": "https://sepolia.uxlinkone.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain