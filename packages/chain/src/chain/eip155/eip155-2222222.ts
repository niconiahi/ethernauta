/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2222222 = {
  "name": "Coinweb BNB shard",
  "shortName": "cweb-bnb",
  "title": "Coinweb BNB shard",
  "chain": "CWEB BNB",
  "rpc": [
    "https://api-cloud.coinweb.io/eth-rpc-service/bnb"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CWEB",
    "symbol": "CWEB",
    "decimals": 18
  },
  "infoURL": "https://coinweb.io",
  "chainId": 2222222,
  "networkId": 2222222,
  "slip44": 1,
  "explorers": [
    {
      "name": "Coinweb block explorer",
      "url": "https://explorer.coinweb.io",
      "standard": "none"
    }
  ]
} satisfies Chain