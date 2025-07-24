/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_230 = {
  "name": "SwapDEX",
  "shortName": "SDX",
  "chain": "SDX",
  "rpc": [
    "https://rpc.swapdex.network",
    "wss://ss.swapdex.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SwapDEX",
    "symbol": "SDX",
    "decimals": 18
  },
  "infoURL": "https://swapdex.network/",
  "chainId": 230,
  "networkId": 230,
  "explorers": [
    {
      "name": "SwapDEX",
      "url": "https://evm.swapdex.network",
      "standard": "none"
    }
  ]
} satisfies Chain