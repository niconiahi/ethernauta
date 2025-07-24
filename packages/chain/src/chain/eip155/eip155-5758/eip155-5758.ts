/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5758 = {
  "name": "SatoshiChain Testnet",
  "shortName": "satst",
  "chain": "SATS",
  "icon": "satoshichain",
  "rpc": [
    "https://testnet-rpc.satoshichain.io"
  ],
  "faucets": [
    "https://faucet.satoshichain.io"
  ],
  "nativeCurrency": {
    "name": "SatoshiChain Coin",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://satoshichain.net",
  "chainId": 5758,
  "networkId": 5758,
  "slip44": 1,
  "explorers": [
    {
      "name": "SatoshiChain Testnet Explorer",
      "url": "https://testnet.satoshiscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain