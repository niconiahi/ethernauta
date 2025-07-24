/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3400 = {
  "name": "Paribu Net Mainnet",
  "shortName": "prb",
  "chain": "PRB",
  "icon": "prb",
  "rpc": [
    "https://rpc.paribu.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "chainId": 3400,
  "networkId": 3400,
  "explorers": [
    {
      "name": "Paribu Net Explorer",
      "url": "https://explorer.paribu.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain