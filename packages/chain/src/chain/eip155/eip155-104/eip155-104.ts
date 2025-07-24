/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_104 = {
  "name": "Kaiba Lightning Chain Testnet",
  "shortName": "tklc",
  "chain": "tKLC",
  "icon": "kaiba",
  "rpc": [
    "https://klc.live/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kaiba Testnet Token",
    "symbol": "tKAIBA",
    "decimals": 18
  },
  "infoURL": "https://kaibadefi.com",
  "chainId": 104,
  "networkId": 104,
  "slip44": 1,
  "explorers": [
    {
      "name": "kaibascan",
      "url": "https://kaibascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain