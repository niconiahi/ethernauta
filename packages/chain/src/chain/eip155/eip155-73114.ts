/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_73114 = {
  "name": "ICB Testnet",
  "shortName": "ICBT",
  "chain": "ICBT",
  "icon": "icbnetwork",
  "rpc": [
    "https://rpc1-testnet.icbnetwork.info/",
    "https://rpc2-testnet.icbnetwork.info/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ICB Testnet Token",
    "symbol": "ICBT",
    "decimals": 18
  },
  "infoURL": "https://icb.network",
  "chainId": 73114,
  "networkId": 73114,
  "explorers": [
    {
      "name": "ICB Tesnet Explorer",
      "url": "https://testnet.icbscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain