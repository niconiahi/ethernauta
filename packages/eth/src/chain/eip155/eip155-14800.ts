/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_14800 = {
  "name": "Vana Moksha Testnet",
  "shortName": "vana-moksha",
  "chain": "Vana Moksha Testnet",
  "rpc": [
    "https://rpc.moksha.vana.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VANA",
    "symbol": "VANA",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 14800,
  "networkId": 14800,
  "explorers": [
    {
      "name": "Vana Moksha Testnet",
      "url": "https://vanascan.io",
      "standard": "none"
    }
  ]
} satisfies Chain