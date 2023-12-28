/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2037 = {
  "name": "Kiwi Subnet",
  "shortName": "kiwi",
  "chain": "KIWI",
  "rpc": [
    "https://subnets.avax.network/kiwi/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Shrapgas",
    "symbol": "SHRAP",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 2037,
  "networkId": 2037,
  "slip44": 1,
  "explorers": [
    {
      "name": "KIWI Explorer",
      "url": "https://subnets-test.avax.network/kiwi",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain