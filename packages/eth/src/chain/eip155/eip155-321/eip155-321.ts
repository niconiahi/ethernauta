/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_321 = {
  "name": "KCC Mainnet",
  "shortName": "kcs",
  "chain": "KCC",
  "rpc": [
    "https://rpc-mainnet.kcc.network",
    "https://kcc.mytokenpocket.vip",
    "https://public-rpc.blockpi.io/http/kcc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KuCoin Token",
    "symbol": "KCS",
    "decimals": 18
  },
  "infoURL": "https://kcc.io",
  "chainId": 321,
  "networkId": 321,
  "slip44": 641,
  "explorers": [
    {
      "name": "KCC Explorer",
      "url": "https://explorer.kcc.io/en",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain