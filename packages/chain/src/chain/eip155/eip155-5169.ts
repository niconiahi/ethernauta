/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5169 = {
  "name": "Smart Layer Network",
  "shortName": "SLN",
  "chain": "SLN",
  "rpc": [
    "https://rpc.main.smartlayer.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Service Unit Token",
    "symbol": "SU",
    "decimals": 18
  },
  "infoURL": "https://www.smartlayer.network/",
  "chainId": 5169,
  "networkId": 5169,
  "explorers": [
    {
      "name": "SLN Mainnet Explorer",
      "url": "https://explorer.main.smartlayer.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain