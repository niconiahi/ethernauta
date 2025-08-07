/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4321 = {
  "name": "Echos Chain",
  "shortName": "echos",
  "chain": "Echos",
  "rpc": [
    "https://rpc-echos-mainnet-0.t.conduit.xyz"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://www.echos.fun/",
  "chainId": 4321,
  "networkId": 4321,
  "explorers": [
    {
      "name": "Echos Explorer",
      "url": "https://explorer.echos.fun",
      "standard": "none"
    }
  ]
} satisfies Chain