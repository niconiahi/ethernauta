/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_624 = {
  "name": "Binary Mainnet",
  "shortName": "thebinaryholdings-mainnet",
  "chain": "The Binary Holdings",
  "rpc": [
    "https://rpc.zero.thebinaryholdings.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Binary Token",
    "symbol": "BNRY",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 624,
  "networkId": 624,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://explorer.thebinaryholdings.com",
      "standard": "none"
    }
  ]
} satisfies Chain