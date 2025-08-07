/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_102030 = {
  "name": "Creditcoin",
  "shortName": "ctc",
  "chain": "CTC",
  "icon": "creditcoin",
  "rpc": [
    "https://mainnet3.creditcoin.network"
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
    "name": "CTC",
    "symbol": "CTC",
    "decimals": 18
  },
  "infoURL": "https://creditcoin.org",
  "chainId": 102030,
  "networkId": 102030,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://creditcoin.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain