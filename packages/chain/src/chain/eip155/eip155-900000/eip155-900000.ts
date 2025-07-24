/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_900000 = {
  "name": "Posichain Mainnet Shard 0",
  "shortName": "psc-s0",
  "chain": "PSC",
  "rpc": [
    "https://api.posichain.org",
    "https://api.s0.posichain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "chainId": 900000,
  "networkId": 900000,
  "explorers": [
    {
      "name": "Posichain Explorer",
      "url": "https://explorer.posichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain