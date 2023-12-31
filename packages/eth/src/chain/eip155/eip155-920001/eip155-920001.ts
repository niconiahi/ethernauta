/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_920001 = {
  "name": "Posichain Devnet Shard 1",
  "shortName": "psc-d-s1",
  "chain": "PSC",
  "rpc": [
    "https://api.s1.d.posichain.org"
  ],
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "chainId": 920001,
  "networkId": 920001,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain