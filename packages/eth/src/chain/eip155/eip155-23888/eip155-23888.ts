/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_23888 = {
  "name": "Blast Testnet",
  "shortName": "blastT",
  "chain": "ETH",
  "icon": "blastIcon",
  "rpc": [
    "http://testnet-rpc.blastblockchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.blastblockchain.com",
  "chainId": 23888,
  "networkId": 23888,
  "explorers": [
    {
      "name": "Blast Testnet",
      "url": "http://testnet-explorer.blastblockchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain