/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_80084 = {
  "name": "Berachain bArtio",
  "shortName": "berachainbArtio",
  "chain": "Berachain bArtio",
  "icon": "berachain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "BERA Token",
    "symbol": "BERA",
    "decimals": 18
  },
  "infoURL": "https://www.berachain.com",
  "chainId": 80084,
  "networkId": 80084,
  "explorers": [
    {
      "name": "Beratrail",
      "url": "https://bartio.beratrail.io",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain