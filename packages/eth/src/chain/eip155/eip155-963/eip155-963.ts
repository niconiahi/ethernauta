/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_963 = {
  "name": "BTC20 Smart Chain",
  "shortName": "btc20",
  "chain": "BTC20",
  "icon": "btc20",
  "rpc": [
    "https://rpc.bitcoincode.technology/"
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
    "name": "BTCC",
    "symbol": "BTCC",
    "decimals": 18
  },
  "infoURL": "https://bitcoincode.technology",
  "chainId": 963,
  "networkId": 963,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.bitcoincode.technology",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain