/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_278611351 = {
  "name": "Razor Skale Chain",
  "shortName": "razor",
  "chain": "Razor Schain",
  "icon": "razornetwork",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"
  ],
  "faucets": [
    "https://faucet.razorscan.io/"
  ],
  "nativeCurrency": {
    "name": "sFuel",
    "symbol": "SFUEL",
    "decimals": 18
  },
  "infoURL": "https://razor.network",
  "chainId": 278611351,
  "networkId": 278611351,
  "explorers": [
    {
      "name": "turbulent-unique-scheat",
      "url": "https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain