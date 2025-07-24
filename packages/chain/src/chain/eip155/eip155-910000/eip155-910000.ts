/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_910000 = {
  "name": "Posichain Testnet Shard 0",
  "shortName": "psc-t-s0",
  "chain": "PSC",
  "rpc": [
    "https://api.s0.t.posichain.org"
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
  "chainId": 910000,
  "networkId": 910000,
  "explorers": [
    {
      "name": "Posichain Explorer Testnet",
      "url": "https://explorer-testnet.posichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain