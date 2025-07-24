/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3000 = {
  "name": "CENNZnet Rata",
  "shortName": "cennz-r",
  "chain": "CENNZnet",
  "icon": "cennz",
  "rpc": [],
  "faucets": [
    "https://app-faucet.centrality.me"
  ],
  "nativeCurrency": {
    "name": "CPAY",
    "symbol": "CPAY",
    "decimals": 18
  },
  "infoURL": "https://cennz.net",
  "chainId": 3000,
  "networkId": 3000
} satisfies Chain