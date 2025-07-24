/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8453 = {
  "name": "Base",
  "shortName": "base",
  "chain": "ETH",
  "icon": "base",
  "rpc": [
    "https://mainnet.base.org/",
    "https://developer-access-mainnet.base.org/",
    "https://base.gateway.tenderly.co",
    "wss://base.gateway.tenderly.co",
    "https://base.publicnode.com",
    "wss://base.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "chainId": 8453,
  "networkId": 8453,
  "explorers": [
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://base.dex.guru",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain