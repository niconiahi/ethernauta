/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2020 = {
  "name": "Ronin Mainnet",
  "shortName": "ron",
  "title": "Ronin",
  "chain": "ronin",
  "rpc": [
    "https://api.roninchain.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "RON",
    "symbol": "RON",
    "decimals": 18
  },
  "infoURL": "https://roninchain.com",
  "chainId": 2020,
  "networkId": 2020,
  "explorers": [
    {
      "name": "Ronin Block Explorer",
      "url": "https://app.roninchain.com",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain