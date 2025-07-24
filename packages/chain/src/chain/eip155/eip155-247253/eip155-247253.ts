/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_247253 = {
  "name": "Saakuru Testnet",
  "shortName": "saakuru-testnet",
  "chain": "Saakuru",
  "icon": "saakuru",
  "rpc": [
    "https://rpc-testnet.saakuru.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://saakuru.network",
  "chainId": 247253,
  "networkId": 247253,
  "slip44": 1,
  "explorers": [
    {
      "name": "saakuru-explorer-testnet",
      "url": "https://explorer-testnet.saakuru.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain