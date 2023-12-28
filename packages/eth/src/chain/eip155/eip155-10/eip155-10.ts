/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10 = {
  "name": "OP Mainnet",
  "shortName": "oeth",
  "chain": "ETH",
  "rpc": [
    "https://mainnet.optimism.io",
    "https://optimism.publicnode.com",
    "wss://optimism.publicnode.com",
    "https://optimism.gateway.tenderly.co",
    "wss://optimism.gateway.tenderly.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optimism.io",
  "chainId": 10,
  "networkId": 10,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://optimistic.etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://optimism.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://optimism.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain