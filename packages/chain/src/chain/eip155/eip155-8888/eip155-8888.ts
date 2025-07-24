/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8888 = {
  "name": "XANAChain",
  "shortName": "XANAChain",
  "chain": "XANAChain",
  "icon": "xeta",
  "rpc": [
    "https://mainnet.xana.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XETA",
    "symbol": "XETA",
    "decimals": 18
  },
  "infoURL": "https://xanachain.xana.net/",
  "chainId": 8888,
  "networkId": 8888,
  "explorers": [
    {
      "name": "XANAChain",
      "url": "https://xanachain.xana.net",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain