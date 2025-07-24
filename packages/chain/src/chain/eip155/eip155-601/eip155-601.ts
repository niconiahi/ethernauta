/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_601 = {
  "name": "Vine Testnet",
  "shortName": "VINE",
  "chain": "VINE",
  "icon": "vine",
  "rpc": [
    "https://rpc-testnet.vne.network"
  ],
  "faucets": [
    "https://vne.network/rose"
  ],
  "nativeCurrency": {
    "name": "VINE",
    "symbol": "VNE",
    "decimals": 18
  },
  "infoURL": "https://www.peer.inc",
  "chainId": 601,
  "networkId": 601,
  "explorers": [
    {
      "name": "Vine Explorer",
      "url": "https://vne.network/rose",
      "standard": "none"
    }
  ]
} satisfies Chain