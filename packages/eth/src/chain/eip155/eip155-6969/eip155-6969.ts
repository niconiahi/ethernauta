/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6969 = {
  "name": "Tomb Chain Mainnet",
  "shortName": "tombchain",
  "chain": "Tomb Chain",
  "rpc": [
    "https://rpc.tombchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tomb",
    "symbol": "TOMB",
    "decimals": 18
  },
  "infoURL": "https://tombchain.com/",
  "chainId": 6969,
  "networkId": 6969,
  "explorers": [
    {
      "name": "tombscout",
      "url": "https://tombscout.com",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-250",
    "bridges": [
      {
        "url": "https://lif3.com/bridge"
      }
    ]
  }
} satisfies Chain