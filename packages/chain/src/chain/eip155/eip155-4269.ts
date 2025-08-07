/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4269 = {
  "name": "Laika Testnet",
  "shortName": "laika-testnet",
  "chain": "LAIKA",
  "icon": "laika",
  "rpc": [
    "https://testnetrpc1.laikachain.dog"
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
  "chainId": 4269,
  "networkId": 4269,
  "explorers": [
    {
      "name": "Laika Testnet Explorer",
      "url": "https://testnet.laikachain.dog",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain