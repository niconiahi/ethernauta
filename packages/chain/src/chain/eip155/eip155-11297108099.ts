/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11297108099 = {
  "name": "Palm Testnet",
  "shortName": "tpalm",
  "chain": "Palm",
  "icon": "palm",
  "rpc": [
    "https://palm-testnet.infura.io/v3/${INFURA_API_KEY}",
    "https://palm-testnet.public.blastapi.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.network",
  "chainId": 11297108099,
  "networkId": 11297108099,
  "slip44": 1,
  "explorers": [
    {
      "name": "Chainlens",
      "url": "https://testnet.palm.chainlens.com",
      "standard": "EIP3091"
    },
    {
      "name": "Dora",
      "url": "https://www.ondora.xyz/network/palm-testnet",
      "standard": "none"
    }
  ]
} satisfies Chain