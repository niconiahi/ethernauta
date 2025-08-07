/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_824 = {
  "name": "Daily Network Mainnet",
  "shortName": "dly",
  "chain": "Daily Network",
  "icon": "daily",
  "rpc": [
    "https://rpc.mainnet.dailycrypto.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Daily",
    "symbol": "DLY",
    "decimals": 18
  },
  "infoURL": "https://dailycrypto.net",
  "chainId": 824,
  "networkId": 824,
  "explorers": [
    {
      "name": "Daily Mainnet Explorer",
      "url": "https://explorer.mainnet.dailycrypto.net",
      "standard": "none"
    }
  ]
} satisfies Chain