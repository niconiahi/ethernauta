/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2649 = {
  "name": "AILayer Mainnet",
  "shortName": "ailayer-mainnet",
  "chain": "AILayer",
  "icon": "ailayer",
  "rpc": [
    "https://mainnet-rpc.ailayer.xyz",
    "wss://mainnet-rpc.ailayer.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://ailayer.xyz/",
  "chainId": 2649,
  "networkId": 2649,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.ailayer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain