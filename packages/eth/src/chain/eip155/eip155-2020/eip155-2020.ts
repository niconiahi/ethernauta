/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2020 = {
  "name": "PublicMint Mainnet",
  "shortName": "pmint",
  "title": "Public Mint Mainnet",
  "chain": "PublicMint",
  "rpc": [
    "https://rpc.publicmint.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "chainId": 2020,
  "networkId": 2020,
  "slip44": 60,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.publicmint.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain