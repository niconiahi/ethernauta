/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_56400 = {
  "name": "Testnet Zeroone Subnet",
  "shortName": "testnetzer",
  "chain": "TESTNETZER",
  "rpc": [
    "https://subnets.avax.network/testnetzer/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://zeroone.art/",
  "chainId": 56400,
  "networkId": 56400,
  "explorers": [
    {
      "name": "TESTNETZER Explorer",
      "url": "https://subnets-test.avax.network/testnetzer",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain