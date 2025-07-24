/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_420420 = {
  "name": "Kekchain",
  "shortName": "KEK",
  "chain": "kek",
  "icon": "kek",
  "rpc": [
    "https://mainnet.kekchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KEK",
    "symbol": "KEK",
    "decimals": 18
  },
  "infoURL": "https://kekchain.com",
  "chainId": 420420,
  "networkId": 103090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.kekchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain