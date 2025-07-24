/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_220315 = {
  "name": "Mas Mainnet",
  "shortName": "mas",
  "chain": "MAS",
  "icon": "mas",
  "rpc": [
    "http://node.masnet.ai:8545"
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
    "name": "Master Bank",
    "symbol": "MAS",
    "decimals": 18
  },
  "infoURL": "https://masterbank.org",
  "chainId": 220315,
  "networkId": 220315,
  "explorers": [
    {
      "name": "explorer masnet",
      "url": "https://explorer.masnet.ai",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain