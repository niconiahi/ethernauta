/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_49088 = {
  "name": "Bifrost Testnet",
  "shortName": "tbfc",
  "title": "Bifrost Network Testnet",
  "chain": "BFC",
  "icon": "bifrost",
  "rpc": [
    "https://public-01.testnet.bifrostnetwork.com/rpc",
    "https://public-02.testnet.bifrostnetwork.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://bifrostnetwork.com",
  "chainId": 49088,
  "networkId": 49088,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.bifrostnetwork.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain