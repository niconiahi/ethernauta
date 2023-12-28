/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4759 = {
  "name": "MEVerse Chain Testnet",
  "shortName": "TESTMEV",
  "chain": "MEVerse",
  "icon": "meverse",
  "rpc": [
    "https://rpc.meversetestnet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "infoURL": "https://www.meverse.sg",
  "chainId": 4759,
  "networkId": 4759,
  "slip44": 1,
  "explorers": [
    {
      "name": "MEVerse Chain Testnet Explorer",
      "url": "https://testnet.meversescan.io",
      "standard": "none"
    }
  ]
} satisfies Chain