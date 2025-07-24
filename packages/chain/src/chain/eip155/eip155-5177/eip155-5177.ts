/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5177 = {
  "name": "TLChain Network Mainnet",
  "shortName": "tlc",
  "chain": "TLC",
  "icon": "tlc",
  "rpc": [
    "https://mainnet-rpc.tlxscan.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TLChain Network",
    "symbol": "TLC",
    "decimals": 18
  },
  "infoURL": "https://tlchain.network/",
  "chainId": 5177,
  "networkId": 5177,
  "explorers": [
    {
      "name": "TLChain Explorer",
      "url": "https://explorer.tlchain.network",
      "standard": "none"
    }
  ]
} satisfies Chain