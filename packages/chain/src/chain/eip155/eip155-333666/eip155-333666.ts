/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_333666 = {
  "name": "Oone Chain Testnet",
  "shortName": "oonetest",
  "chain": "OONE Testnet",
  "rpc": [
    "https://rpc.testnet.oonechain.com"
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
  "chainId": 333666,
  "networkId": 333666,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.oonescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain