/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_52014 = {
  "name": "Electroneum Mainnet",
  "shortName": "etn-mainnet",
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
  "chainId": 52014,
  "networkId": 52014,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockexplorer.electroneum.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain