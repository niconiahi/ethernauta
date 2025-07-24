/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_201 = {
  "name": "MOAC testnet",
  "shortName": "moactest",
  "chain": "MOAC",
  "rpc": [
    "https://gateway.moac.io/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "chainId": 201,
  "networkId": 201,
  "slip44": 1,
  "explorers": [
    {
      "name": "moac testnet explorer",
      "url": "https://testnet.moac.io",
      "standard": "none"
    }
  ]
} satisfies Chain