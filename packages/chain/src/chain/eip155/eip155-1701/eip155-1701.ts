/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1701 = {
  "name": "Anytype EVM Chain",
  "shortName": "AnytypeChain",
  "chain": "ETH",
  "icon": "any",
  "rpc": [
    "https://geth.anytype.io"
  ],
  "faucets": [
    "https://evm.anytype.io/faucet"
  ],
  "nativeCurrency": {
    "name": "ANY",
    "symbol": "ANY",
    "decimals": 18
  },
  "infoURL": "https://evm.anytype.io",
  "chainId": 1701,
  "networkId": 1701,
  "explorers": [
    {
      "name": "Anytype Explorer",
      "url": "https://explorer.anytype.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain