/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_27082022 = {
  "name": "Excoincial Chain Mainnet",
  "shortName": "exl",
  "chain": "EXL",
  "icon": "exl",
  "rpc": [
    "https://rpc.exlscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Exlcoin",
    "symbol": "EXL",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 27082022,
  "networkId": 27082022,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://exlscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain