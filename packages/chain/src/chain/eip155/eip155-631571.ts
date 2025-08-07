/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_631571 = {
  "name": "Polter Testnet",
  "shortName": "poltergeist",
  "chain": "Geist",
  "icon": "polterGeist",
  "rpc": [
    "https://geist-polter.g.alchemy.com/public"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Polter GHST",
    "symbol": "GHST",
    "decimals": 18
  },
  "infoURL": "https://playongeist.com",
  "chainId": 631571,
  "networkId": 631571,
  "explorers": [
    {
      "name": "Polter Testnet Explorer",
      "url": "https://polter-testnet.explorer.alchemy.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain