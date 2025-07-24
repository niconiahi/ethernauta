/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2323 = {
  "name": "SOMA Network Testnet",
  "shortName": "sma",
  "chain": "SOMA",
  "icon": "soma",
  "rpc": [
    "https://data-testnet-v1.somanetwork.io/",
    "https://testnet-au-server-2.somanetwork.io",
    "https://testnet-au-server-1.somanetwork.io",
    "https://testnet-sg-server-1.somanetwork.io",
    "https://testnet-sg-server-2.somanetwork.io"
  ],
  "faucets": [
    "https://faucet.somanetwork.io"
  ],
  "nativeCurrency": {
    "name": "SMA",
    "symbol": "tSMA",
    "decimals": 18
  },
  "infoURL": "https://somanetwork.io",
  "chainId": 2323,
  "networkId": 2323,
  "slip44": 1,
  "explorers": [
    {
      "name": "SOMA Testnet Explorer",
      "url": "https://testnet.somascan.io",
      "standard": "none"
    }
  ]
} satisfies Chain