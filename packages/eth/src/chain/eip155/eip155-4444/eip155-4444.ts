/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4444 = {
  "name": "Htmlcoin Mainnet",
  "shortName": "html",
  "chain": "mainnet",
  "icon": "htmlcoin",
  "rpc": [
    "https://janus.htmlcoin.com/api/"
  ],
  "faucets": [
    "https://gruvin.me/htmlcoin"
  ],
  "nativeCurrency": {
    "name": "Htmlcoin",
    "symbol": "HTML",
    "decimals": 8
  },
  "infoURL": "https://htmlcoin.com",
  "chainId": 4444,
  "networkId": 4444,
  "explorers": [
    {
      "name": "htmlcoin",
      "url": "https://explorer.htmlcoin.com",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain