/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9888 = {
  "name": "Dogelayer Mainnet",
  "shortName": "Dogelayer",
  "chain": "Dogelayer",
  "rpc": [
    "https://dl-rpc.dogelayer.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "infoURL": "https://dogelayer.org",
  "chainId": 9888,
  "networkId": 9888,
  "explorers": [
    {
      "name": "Dogelayer mainnet explorer",
      "url": "https://dl-explorer.dogelayer.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain