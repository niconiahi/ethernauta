/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1314 = {
  "name": "Alyx Mainnet",
  "shortName": "alyx",
  "chain": "ALYX",
  "icon": "alyx",
  "rpc": [
    "https://rpc.alyxchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Alyx Chain Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "infoURL": "https://www.alyxchain.com",
  "chainId": 1314,
  "networkId": 1314,
  "explorers": [
    {
      "name": "alyxscan",
      "url": "https://www.alyxscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain