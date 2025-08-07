/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5039 = {
  "name": "ONIGIRI Test Subnet",
  "shortName": "onigiritest",
  "chain": "ONIGIRI",
  "icon": "onigiri",
  "rpc": [
    "https://subnets.avax.network/onigiri/testnet/rpc"
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
  "chainId": 5039,
  "networkId": 5039,
  "explorers": [
    {
      "name": "ONIGIRI Explorer",
      "url": "https://subnets-test.avax.network/onigiri",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain