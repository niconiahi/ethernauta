/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_78432 = {
  "name": "Conduit Subnet",
  "shortName": "conduit",
  "chain": "CONDUIT",
  "rpc": [
    "https://subnets.avax.network/conduit/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "CON",
    "symbol": "CON",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "chainId": 78432,
  "networkId": 78432,
  "slip44": 1,
  "explorers": [
    {
      "name": "CONDUIT Explorer",
      "url": "https://subnets-test.avax.network/conduit",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain