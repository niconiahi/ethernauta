/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2330 = {
  "name": "Altcoinchain",
  "shortName": "alt",
  "chain": "mainnet",
  "icon": "altcoinchain",
  "rpc": [
    "https://rpc0.altcoinchain.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Altcoin",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://altcoinchain.org",
  "chainId": 2330,
  "networkId": 2330,
  "explorers": [
    {
      "name": "expedition",
      "url": "http://expedition.altcoinchain.org",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain