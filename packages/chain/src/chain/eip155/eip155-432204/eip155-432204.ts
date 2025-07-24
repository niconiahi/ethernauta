/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_432204 = {
  "name": "Dexalot Subnet",
  "shortName": "dexalot",
  "chain": "DEXALOT",
  "icon": "dexalot",
  "rpc": [
    "https://subnets.avax.network/dexalot/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "infoURL": "https://dexalot.com",
  "chainId": 432204,
  "networkId": 432204,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain