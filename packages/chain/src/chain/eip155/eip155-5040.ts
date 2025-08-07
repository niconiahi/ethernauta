/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5040 = {
  "name": "ONIGIRI Subnet",
  "shortName": "onigiri",
  "chain": "ONIGIRI",
  "icon": "onigiri",
  "rpc": [
    "https://subnets.avax.network/onigiri/mainnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "ONIGIRI",
    "symbol": "ONGR",
    "decimals": 18
  },
  "infoURL": "https://www.ongr.org/",
  "chainId": 5040,
  "networkId": 5040,
  "explorers": [
    {
      "name": "ONIGIRI Explorer",
      "url": "https://subnets.avax.network/onigiri",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain