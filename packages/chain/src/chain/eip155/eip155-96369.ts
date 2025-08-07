/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_96369 = {
  "name": "Lux Mainnet",
  "shortName": "lux",
  "chain": "Lux",
  "icon": "lux",
  "rpc": [
    "https://api.lux.network"
  ],
  "faucets": [
    "https://faucet.lux-test.network"
  ],
  "nativeCurrency": {
    "name": "Lux",
    "symbol": "LUX",
    "decimals": 18
  },
  "infoURL": "https://lux.network",
  "chainId": 96369,
  "networkId": 96369,
  "explorers": [
    {
      "name": "Lux Network Explorer",
      "url": "https://explore.lux.network",
      "standard": "EIP3091"
    },
    {
      "name": "Lux Network Explorer",
      "url": "https://explore.lux-test.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain