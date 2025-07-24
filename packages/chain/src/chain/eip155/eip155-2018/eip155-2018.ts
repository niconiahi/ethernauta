/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2018 = {
  "name": "PublicMint Devnet",
  "shortName": "pmint_dev",
  "title": "Public Mint Devnet",
  "chain": "PublicMint",
  "rpc": [
    "https://rpc.dev.publicmint.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "chainId": 2018,
  "networkId": 2018,
  "slip44": 60,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.dev.publicmint.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain