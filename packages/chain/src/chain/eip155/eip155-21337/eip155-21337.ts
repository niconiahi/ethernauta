/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_21337 = {
  "name": "CENNZnet Azalea",
  "shortName": "cennz-a",
  "chain": "CENNZnet",
  "icon": "cennz",
  "rpc": [
    "https://cennznet.unfrastructure.io/public"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "infoURL": "https://cennz.net",
  "chainId": 21337,
  "networkId": 21337,
  "explorers": [
    {
      "name": "UNcover",
      "url": "https://uncoverexplorer.com",
      "standard": "none"
    }
  ]
} satisfies Chain