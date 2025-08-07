/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_555555 = {
  "name": "Pentagon Testnet",
  "shortName": "pentagon-testnet",
  "chain": "Pentagon",
  "icon": "pentagon-testnet",
  "rpc": [
    "https://rpc-testnet.pentagon.games"
  ],
  "faucets": [
    "https://bridge-testnet.pentagon.games"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Pentagon",
    "symbol": "PEN",
    "decimals": 18
  },
  "infoURL": "https://pentagon.games",
  "chainId": 555555,
  "networkId": 555555,
  "explorers": [
    {
      "name": "Pentagon Testnet Explorer",
      "url": "https://explorer-testnet.pentagon.games",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain