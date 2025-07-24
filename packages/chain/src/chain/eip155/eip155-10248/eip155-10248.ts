/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10248 = {
  "name": "0XTade",
  "shortName": "0xt",
  "chain": "0XTade Chain",
  "rpc": [
    "https://node.0xtchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "0XT",
    "symbol": "0XT",
    "decimals": 18
  },
  "infoURL": "https://www.0xtrade.finance/",
  "chainId": 10248,
  "networkId": 10248,
  "explorers": [
    {
      "name": "0xtrade Scan",
      "url": "https://www.0xtscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain