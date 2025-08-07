/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8227 = {
  "name": "Space Subnet",
  "shortName": "space",
  "chain": "SPACE",
  "rpc": [
    "https://subnets.avax.network/space/mainnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "FUEL",
    "symbol": "FUEL",
    "decimals": 18
  },
  "infoURL": "https://otherworld.network",
  "chainId": 8227,
  "networkId": 8227,
  "explorers": [
    {
      "name": "SPACE Explorer",
      "url": "https://subnets.avax.network/space",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain