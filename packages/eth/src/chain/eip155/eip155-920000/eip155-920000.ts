/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_920000 = {
  "name": "Posichain Devnet Shard 0",
  "shortName": "psc-d-s0",
  "chain": "PSC",
  "rpc": [
    "https://api.s0.d.posichain.org"
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
  "chainId": 920000,
  "networkId": 920000,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain