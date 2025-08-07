/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1011 = {
  "name": "Rebus Classic Mainnet",
  "shortName": "rebusclassic",
  "title": "Rebuschain Mainnet",
  "chain": "REBUS",
  "icon": "rebusc",
  "rpc": [
    "https://apievm.rebuschain.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rebus Classic",
    "symbol": "REBUS",
    "decimals": 18
  },
  "infoURL": "https://www.rebuschain.com",
  "chainId": 1011,
  "networkId": 1011,
  "explorers": [
    {
      "name": "Rebus EVM Explorer (Blockscout)",
      "url": "https://evm-l1.rebuschain.com",
      "standard": "none"
    },
    {
      "name": "Rebus Cosmos Explorer (ping.pub)",
      "url": "https://cosmos.rebuschain.com",
      "standard": "none"
    }
  ]
} satisfies Chain