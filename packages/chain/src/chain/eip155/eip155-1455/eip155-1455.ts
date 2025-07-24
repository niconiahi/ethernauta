/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1455 = {
  "name": "Ctex Scan Blockchain",
  "shortName": "CTEX",
  "chain": "Ctex Scan Blockchain",
  "icon": "ctex",
  "rpc": [
    "https://mainnet-rpc.ctexscan.com/"
  ],
  "faucets": [
    "https://faucet.ctexscan.com"
  ],
  "nativeCurrency": {
    "name": "CTEX",
    "symbol": "CTEX",
    "decimals": 18
  },
  "infoURL": "https://ctextoken.io",
  "chainId": 1455,
  "networkId": 1455,
  "explorers": [
    {
      "name": "Ctex Scan Explorer",
      "url": "https://ctexscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain