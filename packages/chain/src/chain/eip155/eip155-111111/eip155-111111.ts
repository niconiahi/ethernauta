/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_111111 = {
  "name": "Siberium Network",
  "shortName": "sbr",
  "chain": "SBR",
  "icon": "siberium",
  "rpc": [
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "chainId": 111111,
  "networkId": 111111,
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 1",
      "url": "https://explorer.main.siberium.net",
      "standard": "EIP3091"
    },
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain