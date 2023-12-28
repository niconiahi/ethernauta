/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_60103 = {
  "name": "Thinkium Testnet Chain 103",
  "shortName": "TKM-test103",
  "chain": "Thinkium",
  "rpc": [
    "https://test103.thinkiumrpc.net/"
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
  "chainId": 60103,
  "networkId": 60103,
  "slip44": 1,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain