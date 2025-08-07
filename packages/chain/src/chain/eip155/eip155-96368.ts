/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_96368 = {
  "name": "Lux Testnet",
  "shortName": "tlux",
  "chain": "Lux",
  "icon": "lux",
  "rpc": [
    "https://api.lux-test.network"
  ],
  "faucets": [
    "https://faucet.lux-test.network"
  ],
  "nativeCurrency": {
    "name": "tLux",
    "symbol": "tLUX",
    "decimals": 18
  },
  "infoURL": "https://lux.network",
  "chainId": 96368,
  "networkId": 96368,
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