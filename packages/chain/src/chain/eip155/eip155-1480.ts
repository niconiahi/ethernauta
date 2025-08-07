/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1480 = {
  "name": "Vana",
  "shortName": "vana",
  "chain": "Vana",
  "icon": "vana",
  "rpc": [
    "https://rpc.vana.org/"
  ],
  "faucets": [
    "https://faucet.vana.org/"
  ],
  "nativeCurrency": {
    "name": "Vana",
    "symbol": "VANA",
    "decimals": 18
  },
  "infoURL": "https://vana.org",
  "chainId": 1480,
  "networkId": 1480,
  "explorers": [
    {
      "name": "Vana Block Explorer",
      "url": "https://vanascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain