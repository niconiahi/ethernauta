/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2014 = {
  "name": "NOW Chain Testnet",
  "shortName": "tnow",
  "chain": "NOW",
  "icon": "nowchain",
  "rpc": [
    "https://rpc-testnet.nowscan.io"
  ],
  "faucets": [
    "https://faucet.nowchain.co"
  ],
  "nativeCurrency": {
    "name": "NOW Coin",
    "symbol": "NOW",
    "decimals": 18
  },
  "infoURL": "https://nowchain.co",
  "chainId": 2014,
  "networkId": 2014,
  "explorers": [
    {
      "name": "nowscan testnet",
      "url": "https://testnet.nowscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain