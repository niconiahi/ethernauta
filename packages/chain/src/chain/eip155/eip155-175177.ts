/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_175177 = {
  "name": "Chronicle - Lit Protocol Testnet",
  "shortName": "lpc",
  "chain": "LPC",
  "icon": "lit",
  "rpc": [
    "https://chain-rpc.litprotocol.com/http"
  ],
  "faucets": [
    "https://faucet.litprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Test LIT",
    "symbol": "tstLIT",
    "decimals": 18
  },
  "infoURL": "https://developer.litprotocol.com/v3/network/rollup",
  "chainId": 175177,
  "networkId": 175177,
  "explorers": [
    {
      "name": "Lit Chronicle Explorer",
      "url": "https://chain.litprotocol.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain