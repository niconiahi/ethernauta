/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20765 = {
  "name": "Jono11 Subnet",
  "shortName": "jono11",
  "chain": "JONO11",
  "icon": "jono11",
  "rpc": [
    "https://subnets.avax.network/jono11/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Jono11 Token",
    "symbol": "JONO",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 20765,
  "networkId": 20765,
  "explorers": [
    {
      "name": "JONO11 Explorer",
      "url": "https://subnets-test.avax.network/jono11",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain