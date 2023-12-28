/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_49088 = {
  "name": "Bifrost Testnet",
  "shortName": "tbfc",
  "title": "Bifrost Network Testnet",
  "chain": "BFC",
  "icon": "bifrost",
  "rpc": [
    "https://public-01.testnet.thebifrost.io/rpc",
    "https://public-02.testnet.thebifrost.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://thebifrost.io",
  "chainId": 49088,
  "networkId": 49088,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain