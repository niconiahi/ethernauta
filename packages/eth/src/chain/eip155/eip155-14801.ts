/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_14801 = {
  "name": "Vana Satori Testnet",
  "shortName": "satori",
  "chain": "Satori",
  "rpc": [
    "http://rpc.satori.vana.org"
  ],
  "faucets": [
    "https://faucet.vana.org"
  ],
  "nativeCurrency": {
    "name": "DAT",
    "symbol": "DAT",
    "decimals": 18
  },
  "infoURL": "https://satori.vana.org",
  "chainId": 14801,
  "networkId": 14801,
  "explorers": [
    {
      "name": "satoriscan",
      "url": "https://satori.vanascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain