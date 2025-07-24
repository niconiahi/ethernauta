/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_60002 = {
  "name": "Thinkium Testnet Chain 2",
  "shortName": "TKM-test2",
  "chain": "Thinkium",
  "rpc": [
    "https://test2.thinkiumrpc.net/"
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "chainId": 60002,
  "networkId": 60002,
  "slip44": 1,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain