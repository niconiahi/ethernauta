/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6779 = {
  "name": "Compverse Mainnet",
  "shortName": "compverse",
  "chain": "CPV",
  "icon": "compverse",
  "rpc": [
    "https://rpc.compverse.io/",
    "https://rpc-useast1.compverse.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "compverse",
    "symbol": "CPV",
    "decimals": 18
  },
  "infoURL": "https://compverse.io",
  "chainId": 6779,
  "networkId": 6779,
  "slip44": 7779,
  "explorers": [
    {
      "name": "cpvscan",
      "url": "https://scan.compverse.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain