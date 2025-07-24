/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_137 = {
  "name": "Polygon Mainnet",
  "shortName": "matic",
  "chain": "Polygon",
  "icon": "polygon",
  "rpc": [
    "https://polygon-rpc.com/",
    "https://rpc-mainnet.matic.network",
    "https://matic-mainnet.chainstacklabs.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://matic-mainnet-full-rpc.bwarelabs.com",
    "https://polygon-bor.publicnode.com",
    "wss://polygon-bor.publicnode.com",
    "https://polygon.gateway.tenderly.co",
    "wss://polygon.gateway.tenderly.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "chainId": 137,
  "networkId": 137,
  "slip44": 966,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://polygonscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://polygon.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain