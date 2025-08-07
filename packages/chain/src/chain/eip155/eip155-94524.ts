/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_94524 = {
  "name": "XCHAIN",
  "shortName": "xc",
  "chain": "XCHAIN",
  "rpc": [
    "https://xchain-rpc.kuma.bid"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kuma.bid",
  "chainId": 94524,
  "networkId": 94524,
  "explorers": [
    {
      "name": "XCHAIN Explorer",
      "url": "https://xchain-explorer.kuma.bid",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain