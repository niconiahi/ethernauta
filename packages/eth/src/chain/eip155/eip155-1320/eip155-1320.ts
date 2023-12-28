/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1320 = {
  "name": "AIA Testnet",
  "shortName": "aiatestnet",
  "chain": "AIA",
  "icon": "aia",
  "rpc": [
    "https://aia-dataseed1-testnet.aiachain.org"
  ],
  "faucets": [
    "https://aia-faucet-testnet.aiachain.org"
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
    "name": "AIA Testnet",
    "symbol": "AIA",
    "decimals": 18
  },
  "infoURL": "https://aiachain.org",
  "chainId": 1320,
  "networkId": 1320,
  "slip44": 1,
  "explorers": [
    {
      "name": "AIA Chain Explorer Testnet",
      "url": "https://testnet.aiascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain