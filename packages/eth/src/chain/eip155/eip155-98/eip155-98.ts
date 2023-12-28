/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_98 = {
  "name": "Six Protocol",
  "shortName": "six",
  "chain": "SIXNET",
  "icon": "six",
  "rpc": [
    "https://sixnet-rpc-evm.sixprotocol.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SIX evm token",
    "symbol": "SIX",
    "decimals": 18
  },
  "infoURL": "https://six.network/",
  "chainId": 98,
  "networkId": 98,
  "explorers": [
    {
      "name": "SIX Scan",
      "url": "https://sixscan.io/sixnet",
      "standard": "none"
    }
  ]
} satisfies Chain