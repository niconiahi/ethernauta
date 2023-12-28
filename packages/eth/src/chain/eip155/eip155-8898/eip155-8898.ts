/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8898 = {
  "name": "Mammoth Mainnet",
  "shortName": "mmt",
  "title": "Mammoth Chain",
  "chain": "MMT",
  "icon": "mmt",
  "rpc": [
    "https://dataseed.mmtscan.io",
    "https://dataseed1.mmtscan.io",
    "https://dataseed2.mmtscan.io"
  ],
  "faucets": [
    "https://faucet.mmtscan.io/"
  ],
  "nativeCurrency": {
    "name": "Mammoth Token",
    "symbol": "MMT",
    "decimals": 18
  },
  "infoURL": "https://mmtchain.io/",
  "chainId": 8898,
  "networkId": 8898,
  "explorers": [
    {
      "name": "mmtscan",
      "url": "https://mmtscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain