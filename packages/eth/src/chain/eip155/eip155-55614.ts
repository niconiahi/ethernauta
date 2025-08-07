/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_55614 = {
  "name": "Flamma Mainnet",
  "shortName": "FlammaMainnet",
  "chain": "Flamma",
  "rpc": [
    "https://rpc.flamma.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flamma",
    "symbol": "FLA",
    "decimals": 18
  },
  "infoURL": "https://flamma.network",
  "chainId": 55614,
  "networkId": 55614,
  "explorers": [
    {
      "name": "flascan",
      "url": "https://flascan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain