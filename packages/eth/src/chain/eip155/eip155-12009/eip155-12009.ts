/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12009 = {
  "name": "SatoshiChain Mainnet",
  "shortName": "sats",
  "chain": "SATS",
  "icon": "satoshichain",
  "rpc": [
    "https://mainnet-rpc.satoshichain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "chainId": 12009,
  "networkId": 12009,
  "explorers": [
    {
      "name": "SatoshiChain Explorer",
      "url": "https://satoshiscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain