/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2017 = {
  "name": "Adiri",
  "shortName": "tel",
  "title": "Telcoin Network Testnet",
  "chain": "TEL",
  "icon": "telcoin",
  "rpc": [
    "https://rpc.telcoin.network",
    "https://adiri.tel",
    "https://node1.telcoin.network",
    "https://node2.telcoin.network",
    "https://node3.telcoin.network",
    "https://node4.telcoin.network"
  ],
  "faucets": [
    "https://telcoin.network/faucet"
  ],
  "nativeCurrency": {
    "name": "Telcoin",
    "symbol": "TEL",
    "decimals": 18
  },
  "infoURL": "https://telcoin.network",
  "chainId": 2017,
  "networkId": 2017,
  "slip44": 1,
  "explorers": [
    {
      "name": "telscan",
      "url": "https://telscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain