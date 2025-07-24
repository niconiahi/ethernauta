/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_35443 = {
  "name": "Q Testnet",
  "shortName": "q-testnet",
  "chain": "Q",
  "icon": "q",
  "rpc": [
    "https://rpc.qtestnet.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "https://q.org/",
  "chainId": 35443,
  "networkId": 35443,
  "slip44": 1,
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.qtestnet.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain