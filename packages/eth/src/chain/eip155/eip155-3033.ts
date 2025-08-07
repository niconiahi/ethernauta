/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3033 = {
  "name": "Rebus Testnet",
  "shortName": "rebus-testnet",
  "title": "Rebuschain Testnet",
  "chain": "REBUS",
  "icon": "rebus",
  "rpc": [
    "https://testnet.rebus.money/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rebus",
    "symbol": "REBUS",
    "decimals": 18
  },
  "infoURL": "https://www.rebuschain.com",
  "chainId": 3033,
  "networkId": 3033,
  "explorers": [
    {
      "name": "Rebus EVM Explorer (Blockscout)",
      "url": "https://evm.testnet.rebus.money",
      "standard": "none"
    },
    {
      "name": "Rebus Cosmos Explorer (ping.pub)",
      "url": "https://testnet.rebus.money/rebustestnet",
      "standard": "none"
    }
  ]
} satisfies Chain