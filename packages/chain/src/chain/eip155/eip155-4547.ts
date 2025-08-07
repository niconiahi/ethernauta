/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4547 = {
  "name": "TRUMPCHAIN",
  "shortName": "TRUMPCHAIN",
  "chain": "trumpchain",
  "icon": "trump",
  "rpc": [
    "https://testnet.trumpchain.dev/http",
    "wss://testnet.trumpchain.dev/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Official Trump",
    "symbol": "TRUMP",
    "decimals": 18
  },
  "infoURL": "https://trumpchain.dev",
  "chainId": 4547,
  "networkId": 4547,
  "explorers": [
    {
      "name": "TRUMPCHAIN Explorer",
      "url": "https://explorer.trumpchain.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain