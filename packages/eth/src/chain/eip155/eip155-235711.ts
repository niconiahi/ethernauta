/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_235711 = {
  "name": "Universe Testnet",
  "shortName": "unitestnet",
  "chain": "Universe",
  "icon": "universe",
  "rpc": [
    "https://blockchain.dev-universe-bank.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Universe Token",
    "symbol": "UNI",
    "decimals": 18
  },
  "infoURL": "https://www.universe-bank.com/universal-ledger-system",
  "chainId": 235711,
  "networkId": 235711,
  "explorers": [
    {
      "name": "Universe Testnet Explorer",
      "url": "https://blockchain-explorer.dev-universe-bank.com",
      "standard": "none"
    }
  ]
} satisfies Chain