/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12715 = {
  "name": "Rikeza Network Testnet",
  "shortName": "tRIK",
  "title": "Rikeza Network Testnet",
  "chain": "Rikeza",
  "icon": "rikeza",
  "rpc": [
    "https://testnet-rpc.rikscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "chainId": 12715,
  "networkId": 12715,
  "slip44": 1,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain