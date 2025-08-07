/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_23023 = {
  "name": "PremiumBlock",
  "shortName": "pblk",
  "chain": "PBLK",
  "rpc": [
    "https://rpc.premiumblock.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Premium Block",
    "symbol": "PBLK",
    "decimals": 18
  },
  "infoURL": "https://scan.premiumblock.org",
  "chainId": 23023,
  "networkId": 23023,
  "explorers": [
    {
      "name": "PremiumBlocks Explorer",
      "url": "https://scan.premiumblock.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain