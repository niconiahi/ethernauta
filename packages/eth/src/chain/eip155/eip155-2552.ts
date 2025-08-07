/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2552 = {
  "name": "Bahamut horizon",
  "shortName": "horizon",
  "title": "Bahamut horizon",
  "chain": "Bahamut",
  "icon": "bahamut",
  "rpc": [
    "https://horizon-fastex-testnet.zeeve.net"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://bahamut.io",
  "chainId": 2552,
  "networkId": 2552,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://horizon.ftnscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain