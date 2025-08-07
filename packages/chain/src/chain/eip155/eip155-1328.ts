/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1328 = {
  "name": "Sei Testnet",
  "shortName": "sei-testnet",
  "chain": "Sei",
  "icon": "sei",
  "rpc": [
    "https://evm-rpc-testnet.sei-apis.com",
    "wss://evm-ws-testnet.sei-apis.com"
  ],
  "faucets": [
    "https://atlantic-2.app.sei.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "infoURL": "https://www.sei.io",
  "chainId": 1328,
  "networkId": 1328,
  "explorers": [
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain