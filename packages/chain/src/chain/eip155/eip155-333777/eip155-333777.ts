/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_333777 = {
  "name": "Oone Chain Devnet",
  "shortName": "oonedev",
  "chain": "OONE Devnet",
  "rpc": [
    "https://rpc.dev.oonechain.com"
  ],
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "nativeCurrency": {
    "name": "tOONE",
    "symbol": "tOONE",
    "decimals": 18
  },
  "infoURL": "https://oonechain.com",
  "chainId": 333777,
  "networkId": 333777,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://dev.oonescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain