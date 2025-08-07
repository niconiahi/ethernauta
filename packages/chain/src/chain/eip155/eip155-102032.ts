/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_102032 = {
  "name": "Creditcoin Devnet",
  "shortName": "ctcdev",
  "chain": "CTC",
  "icon": "creditcoin",
  "rpc": [
    "https://rpc.cc3-devnet.creditcoin.network"
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
    "name": "Devnet CTC",
    "symbol": "devCTC",
    "decimals": 18
  },
  "infoURL": "https://creditcoin.org",
  "chainId": 102032,
  "networkId": 102032,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://creditcoin-devnet.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain