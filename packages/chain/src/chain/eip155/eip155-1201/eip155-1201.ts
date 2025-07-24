/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1201 = {
  "name": "Evanesco Testnet",
  "shortName": "avis",
  "chain": "Evanesco Testnet",
  "rpc": [
    "https://seed5.evanesco.org:8547"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AVIS",
    "symbol": "AVIS",
    "decimals": 18
  },
  "infoURL": "https://evanesco.org/",
  "chainId": 1201,
  "networkId": 1201,
  "slip44": 1
} satisfies Chain