/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5201420 = {
  "name": "Electroneum Testnet",
  "shortName": "etn-testnet",
  "chain": "Electroneum",
  "icon": "electroneum",
  "rpc": [
    "https://api.electroneum.com"
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
    "name": "Electroneum",
    "symbol": "ETN",
    "decimals": 18
  },
  "infoURL": "https://electroneum.com",
  "chainId": 5201420,
  "networkId": 5201420,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockexplorer.thesecurityteam.rocks",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain