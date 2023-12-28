/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9322252 = {
  "name": "XCAP",
  "shortName": "xcap",
  "title": "XCAP Mainnet",
  "chain": "XCAP",
  "icon": "xcap",
  "rpc": [
    "https://xcap-mainnet.relay.xcap.network/znzvh2ueyvm2yts5fv5gnul395jbkfb2/rpc1"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "infoURL": "https://xcap.network/",
  "chainId": 9322252,
  "networkId": 9322252,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://xcap-mainnet.explorer.xcap.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain