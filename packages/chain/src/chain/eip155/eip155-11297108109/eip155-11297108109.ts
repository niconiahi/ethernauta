/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11297108109 = {
  "name": "Palm",
  "shortName": "palm",
  "chain": "Palm",
  "icon": "palm",
  "rpc": [
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.io",
  "chainId": 11297108109,
  "networkId": 11297108109,
  "explorers": [
    {
      "name": "Palm Explorer",
      "url": "https://explorer.palm.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain