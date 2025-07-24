/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5555558 = {
  "name": "Imversed Testnet",
  "shortName": "imversed-testnet",
  "chain": "Imversed",
  "icon": "imversed",
  "rpc": [
    "https://jsonrpc-test.imversed.network",
    "https://ws-jsonrpc-test.imversed.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "infoURL": "https://imversed.com",
  "chainId": 5555558,
  "networkId": 5555558,
  "slip44": 1,
  "explorers": [
    {
      "name": "Imversed EVM Explorer (Blockscout)",
      "url": "https://txe-test.imversed.network",
      "standard": "EIP3091"
    },
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-t.imversed.com",
      "standard": "none"
    }
  ]
} satisfies Chain