/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6942 = {
  "name": "Laika Mainnet",
  "shortName": "laika",
  "chain": "LAIKA",
  "icon": "laika",
  "rpc": [
    "https://mainnetrpc.laikachain.dog"
  ],
  "faucets": [
    "https://laikachain.dog/faucets"
  ],
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "infoURL": "https://laikachain.dog",
  "chainId": 6942,
  "networkId": 6942,
  "explorers": [
    {
      "name": "Laika Mainnet Explorer",
      "url": "https://explorer.laikachain.dog",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain