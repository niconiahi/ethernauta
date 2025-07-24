/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_80001 = {
  "name": "Mumbai",
  "shortName": "maticmum",
  "title": "Polygon Testnet Mumbai",
  "chain": "Polygon",
  "icon": "polygon",
  "rpc": [
    "https://rpc-mumbai.maticvigil.com",
    "https://polygon-mumbai-bor.publicnode.com",
    "wss://polygon-mumbai-bor.publicnode.com",
    "https://polygon-mumbai.gateway.tenderly.co",
    "wss://polygon-mumbai.gateway.tenderly.co"
  ],
  "faucets": [
    "https://faucet.polygon.technology/"
  ],
  "nativeCurrency": {
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "chainId": 80001,
  "networkId": 80001,
  "slip44": 1,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://mumbai.polygonscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain