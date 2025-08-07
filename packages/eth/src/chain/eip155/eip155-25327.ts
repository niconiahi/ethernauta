/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_25327 = {
  "name": "Everclear Mainnet",
  "shortName": "Everclear",
  "chain": "Everclear Mainnet",
  "rpc": [
    "https://rpc.everclear.raas.gelato.cloud"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 25327,
  "networkId": 25327,
  "explorers": [
    {
      "name": "Everclear",
      "url": "https://scan.everclear.org",
      "standard": "none"
    }
  ]
} satisfies Chain