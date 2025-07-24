/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_21912 = {
  "name": "BSL Mainnet",
  "shortName": "onf",
  "chain": "BSL",
  "rpc": [
    "http://rpc-mainnet.nftruth.io:8545",
    "ws://rpc-mainnet.nftruth.io:8645"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Origin NFT",
    "symbol": "ONF",
    "decimals": 18
  },
  "infoURL": "https://bsquarelab.com/",
  "chainId": 21912,
  "networkId": 21912,
  "explorers": [
    {
      "name": "BSL Mainnet Explorer",
      "url": "https://scan.nftruth.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain