/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1499 = {
  "name": "iDos Games Chain Testnet",
  "shortName": "IGC",
  "chain": "IGC",
  "icon": "igc-testnet",
  "rpc": [
    "https://rpc-testnet.idos.games"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "iDos Games Coin",
    "symbol": "IGC",
    "decimals": 18
  },
  "infoURL": "https://idosgames.com/",
  "chainId": 1499,
  "networkId": 1499,
  "explorers": [
    {
      "name": "IGC-Scan",
      "url": "https://igcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain