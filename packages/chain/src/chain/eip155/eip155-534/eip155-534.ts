/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_534 = {
  "name": "Candle",
  "shortName": "CNDL",
  "chain": "Candle",
  "rpc": [
    "https://candle-rpc.com/",
    "https://rpc.cndlchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CANDLE",
    "symbol": "CNDL",
    "decimals": 18
  },
  "infoURL": "https://candlelabs.org/",
  "chainId": 534,
  "networkId": 534,
  "slip44": 674,
  "explorers": [
    {
      "name": "candleexplorer",
      "url": "https://candleexplorer.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain