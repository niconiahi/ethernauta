/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_42161 = {
  "name": "Arbitrum One",
  "shortName": "arb1",
  "chain": "ETH",
  "rpc": [
    "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://arb1.arbitrum.io/rpc",
    "https://arbitrum-one.publicnode.com",
    "wss://arbitrum-one.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "chainId": 42161,
  "networkId": 42161,
  "explorers": [
    {
      "name": "Arbiscan",
      "url": "https://arbiscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Arbitrum Explorer",
      "url": "https://explorer.arbitrum.io",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://arbitrum.dex.guru",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain