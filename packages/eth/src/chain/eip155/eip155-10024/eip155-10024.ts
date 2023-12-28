/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10024 = {
  "name": "Gon Chain",
  "shortName": "gon",
  "chain": "GonChain",
  "icon": "gonchain",
  "rpc": [
    "https://node1.testnet.gaiaopen.network",
    "https://node1.mainnet.gon.network",
    "https://node2.mainnet.gon.network",
    "https://node3.mainnet.gon.network",
    "https://node4.mainnet.gon.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gon Token",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 10024,
  "networkId": 10024,
  "explorers": [
    {
      "name": "Gon Explorer",
      "url": "https://gonscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain