/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_212 = {
  "name": "MAP Makalu",
  "shortName": "makalu",
  "title": "MAP Testnet Makalu",
  "chain": "MAP",
  "rpc": [
    "https://testnet-rpc.maplabs.io"
  ],
  "faucets": [
    "https://faucet.maplabs.io"
  ],
  "nativeCurrency": {
    "name": "Makalu MAP",
    "symbol": "MAP",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "chainId": 212,
  "networkId": 212,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://testnet.mapscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain