/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_71 = {
  "name": "Conflux eSpace (Testnet)",
  "shortName": "cfxtest",
  "chain": "Conflux",
  "icon": "conflux",
  "rpc": [
    "https://evmtestnet.confluxrpc.com"
  ],
  "faucets": [
    "https://faucet.confluxnetwork.org"
  ],
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "infoURL": "https://confluxnetwork.org",
  "chainId": 71,
  "networkId": 71,
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evmtestnet.confluxscan.net",
      "standard": "none"
    }
  ]
} satisfies Chain