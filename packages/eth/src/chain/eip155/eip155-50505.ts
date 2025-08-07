/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_50505 = {
  "name": "STB Testnet",
  "shortName": "stb-testnet",
  "chain": "STB Testnet",
  "rpc": [
    "https://rpc.quorum.sps.dev.kode.ru/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STB",
    "symbol": "STB",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 50505,
  "networkId": 50505,
  "explorers": [
    {
      "name": "stb-testnet",
      "url": "https://explorer.quorum.sps.dev.kode.ru",
      "standard": "none"
    }
  ]
} satisfies Chain