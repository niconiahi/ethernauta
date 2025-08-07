/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_570 = {
  "name": "Rollux Mainnet",
  "shortName": "sys-rollux",
  "chain": "SYS",
  "rpc": [
    "https://rpc.rollux.com",
    "wss://rpc.rollux.com/wss",
    "https://rpc.ankr.com/rollux"
  ],
  "faucets": [
    "https://rollux.id/faucet"
  ],
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "infoURL": "https://rollux.com",
  "chainId": 570,
  "networkId": 570,
  "explorers": [
    {
      "name": "Rollux Mainnet Explorer",
      "url": "https://explorer.rollux.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain