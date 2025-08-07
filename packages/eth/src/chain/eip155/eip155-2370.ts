/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2370 = {
  "name": "Nexis Network Testnet",
  "shortName": "nzt",
  "chain": "Nexis Network",
  "icon": "nexis",
  "rpc": [
    "https://evm-testnet.nexis.network"
  ],
  "faucets": [
    "https://evm-faucet.nexis.network"
  ],
  "nativeCurrency": {
    "name": "Nexis",
    "symbol": "NZT",
    "decimals": 18
  },
  "infoURL": "https://nexis.network/",
  "chainId": 2370,
  "networkId": 2370,
  "explorers": [
    {
      "name": "Nexis Testnet Explorer",
      "url": "https://evm-testnet.nexscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain