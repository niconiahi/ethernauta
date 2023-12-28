/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1433 = {
  "name": "Rikeza Network Mainnet",
  "shortName": "RIK",
  "title": "Rikeza Network Mainnet",
  "chain": "Rikeza",
  "icon": "rikeza",
  "rpc": [
    "https://rpc.rikscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "chainId": 1433,
  "networkId": 1433,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://rikscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain