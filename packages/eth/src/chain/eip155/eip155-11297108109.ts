/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11297108109 = {
  "name": "Palm",
  "shortName": "palm",
  "chain": "Palm",
  "icon": "palm",
  "rpc": [
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://palm-mainnet.public.blastapi.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.network",
  "chainId": 11297108109,
  "networkId": 11297108109,
  "explorers": [
    {
      "name": "Chainlens",
      "url": "https://palm.chainlens.com",
      "standard": "EIP3091"
    },
    {
      "name": "Dora",
      "url": "https://www.ondora.xyz/network/palm",
      "standard": "none"
    }
  ]
} satisfies Chain