/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_800 = {
  "name": "Lucid Blockchain",
  "shortName": "LUCID",
  "chain": "Lucid",
  "icon": "lucid",
  "rpc": [
    "https://rpc.lucidcoin.io"
  ],
  "faucets": [
    "https://faucet.lucidcoin.io"
  ],
  "nativeCurrency": {
    "name": "LUCID",
    "symbol": "LUCID",
    "decimals": 18
  },
  "infoURL": "https://lucidcoin.io",
  "chainId": 800,
  "networkId": 800,
  "explorers": [
    {
      "name": "Lucid Explorer",
      "url": "https://explorer.lucidcoin.io",
      "standard": "none"
    }
  ]
} satisfies Chain