/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_474142 = {
  "name": "OpenChain Mainnet",
  "shortName": "oc",
  "chain": "OpenChain",
  "rpc": [
    "https://baas-rpc.luniverse.io:18545?lChainId=1641349324562974539"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OpenCoin",
    "symbol": "OPC",
    "decimals": 10
  },
  "infoURL": "https://www.openchain.live",
  "chainId": 474142,
  "networkId": 474142,
  "explorers": [
    {
      "name": "SIDE SCAN",
      "url": "https://sidescan.luniverse.io/1641349324562974539",
      "standard": "none"
    }
  ]
} satisfies Chain