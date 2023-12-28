/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3001 = {
  "name": "CENNZnet Nikau",
  "shortName": "cennz-n",
  "chain": "CENNZnet",
  "icon": "cennz",
  "rpc": [
    "https://nikau.centrality.me/public"
  ],
  "faucets": [
    "https://app-faucet.centrality.me"
  ],
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "infoURL": "https://cennz.net",
  "chainId": 3001,
  "networkId": 3001,
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://www.uncoverexplorer.com/?network=Nikau",
      "standard": "none"
    }
  ]
} satisfies Chain