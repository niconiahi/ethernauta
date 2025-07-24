/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1099 = {
  "name": "MOAC mainnet",
  "shortName": "moac",
  "chain": "MOAC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "chainId": 1099,
  "networkId": 1099,
  "slip44": 314,
  "explorers": [
    {
      "name": "moac explorer",
      "url": "https://explorer.moac.io",
      "standard": "none"
    }
  ]
} satisfies Chain