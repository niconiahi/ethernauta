/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_504441 = {
  "name": "Playdapp Network",
  "shortName": "PDA",
  "chain": "PDA",
  "icon": "pda",
  "rpc": [
    "https://subnets.avax.network/playdappne/mainnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Playdapp",
    "symbol": "PDA",
    "decimals": 18
  },
  "infoURL": "https://playdapp.io",
  "chainId": 504441,
  "networkId": 504441,
  "explorers": [
    {
      "name": "Playdapp Explorer",
      "url": "https://subnets.avax.network/playdappne",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain