/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_323213 = {
  "name": "Bloom Genesis Testnet",
  "shortName": "BGBC-Testnet",
  "chain": "Bloom",
  "icon": "bloom",
  "rpc": [
    "https://testnet-rpc.bloomgenesis.com"
  ],
  "faucets": [
    "https://faucet.bloomgenesis.com"
  ],
  "nativeCurrency": {
    "name": "Bloom",
    "symbol": "BGBC",
    "decimals": 18
  },
  "infoURL": "https://www.bloomgenesis.com",
  "chainId": 323213,
  "networkId": 323213,
  "explorers": [
    {
      "name": "Bloom Genesis Testnet",
      "url": "https://testnet.bloomgenesis.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain