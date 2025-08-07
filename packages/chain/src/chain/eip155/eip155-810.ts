/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_810 = {
  "name": "Haven1 Testnet",
  "shortName": "h1",
  "chain": "haven1",
  "icon": "haven1",
  "rpc": [
    "https://testnet-rpc.haven1.org"
  ],
  "faucets": [
    "https://www.haven1.org/faucet"
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
    "name": "Haven1",
    "symbol": "H1",
    "decimals": 18
  },
  "infoURL": "https://www.haven1.org",
  "chainId": 810,
  "networkId": 810,
  "explorers": [
    {
      "name": "Haven1 Explorer",
      "url": "https://testnet-explorer.haven1.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain