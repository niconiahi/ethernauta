/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3068 = {
  "name": "Bifrost Mainnet",
  "shortName": "bfc",
  "title": "Bifrost Network Mainnet",
  "chain": "BFC",
  "icon": "bifrost",
  "rpc": [
    "https://public-01.mainnet.bifrostnetwork.com/rpc",
    "https://public-02.mainnet.bifrostnetwork.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://bifrostnetwork.com",
  "chainId": 3068,
  "networkId": 3068,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.mainnet.bifrostnetwork.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain