/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2038 = {
  "name": "Shrapnel Testnet",
  "shortName": "shraptest",
  "chain": "SHRAPNEL",
  "rpc": [
    "https://subnets.avax.network/shrapnel/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "SHRAPG",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "chainId": 2038,
  "networkId": 2038,
  "slip44": 1,
  "explorers": [
    {
      "name": "SHRAPNEL Explorer",
      "url": "https://subnets-test.avax.network/shrapnel",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain