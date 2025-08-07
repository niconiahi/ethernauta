/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2648 = {
  "name": "AILayer Testnet",
  "shortName": "ailayer-testnet",
  "chain": "AILayer",
  "icon": "ailayer",
  "rpc": [
    "https://testnet-rpc.ailayer.xyz",
    "wss://testnet-rpc.ailayer.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://ailayer.xyz/",
  "chainId": 2648,
  "networkId": 2648,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.ailayer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain