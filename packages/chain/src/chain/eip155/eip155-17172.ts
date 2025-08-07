/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_17172 = {
  "name": "Eclipse Subnet",
  "shortName": "eclipse",
  "chain": "ECLIPSE",
  "rpc": [
    "https://subnets.avax.network/eclipse/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Eclipse",
    "symbol": "ECLP",
    "decimals": 16
  },
  "infoURL": "http://eclipsenet.io",
  "chainId": 17172,
  "networkId": 17172,
  "explorers": [
    {
      "name": "ECLIPSE Explorer",
      "url": "https://subnets-test.avax.network/eclipse",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain