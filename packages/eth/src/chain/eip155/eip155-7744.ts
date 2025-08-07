/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7744 = {
  "name": "Phron Testnet",
  "shortName": "phr",
  "chain": "PHR",
  "icon": "phron",
  "rpc": [
    "https://testnet.phron.ai",
    "wss://testnet.phron.ai"
  ],
  "faucets": [
    "https://faucet.phron.ai"
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
    "name": "Phron",
    "symbol": "TPHR",
    "decimals": 18
  },
  "infoURL": "https://phron.ai",
  "chainId": 7744,
  "networkId": 7744,
  "explorers": [
    {
      "name": "phronscan",
      "url": "https://testnet.phronscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain