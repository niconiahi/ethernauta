/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10241025 = {
  "name": "ALIENX Hal Testnet",
  "shortName": "ALIENXHal",
  "chain": "ALIENX Hal",
  "icon": "hal",
  "rpc": [
    "https://hal-rpc.alienxchain.io/http",
    "https://hal.rpc.caldera.xyz/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://alienxchain.io/home",
  "chainId": 10241025,
  "networkId": 10241025,
  "explorers": [
    {
      "name": "Hal Explorer",
      "url": "https://hal-explorer.alienxchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain