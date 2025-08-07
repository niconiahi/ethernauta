/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_16180 = {
  "name": "PLYR PHI",
  "shortName": "plyr-phi",
  "chain": "PLYR",
  "icon": "plyr",
  "rpc": [
    "https://subnets.avax.network/plyr/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PLYR",
    "symbol": "PLYR",
    "decimals": 18
  },
  "infoURL": "https://plyr.network",
  "chainId": 16180,
  "networkId": 16180,
  "explorers": [
    {
      "name": "PLYR PHI Explorer",
      "url": "https://explorer.plyr.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain