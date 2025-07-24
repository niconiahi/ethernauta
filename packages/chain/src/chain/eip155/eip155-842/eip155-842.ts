/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_842 = {
  "name": "Taraxa Testnet",
  "shortName": "taratest",
  "chain": "Tara",
  "icon": "taraxa",
  "rpc": [
    "https://rpc.testnet.taraxa.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "chainId": 842,
  "networkId": 842,
  "slip44": 1,
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.testnet.taraxa.io",
      "standard": "none"
    }
  ]
} satisfies Chain