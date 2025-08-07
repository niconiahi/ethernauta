/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6320 = {
  "name": "NFB Chain Testnet",
  "shortName": "nfbchaintest",
  "chain": "NFB Chain Testnet",
  "rpc": [
    "https://testnet-node.nfbchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NFBCoinTest",
    "symbol": "NFBCT",
    "decimals": 18
  },
  "infoURL": "https://nfbchain.com/",
  "chainId": 6320,
  "networkId": 6320,
  "explorers": [
    {
      "name": "NFB Chain Testnet Explorer",
      "url": "https://testnet-scan.nfbchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain