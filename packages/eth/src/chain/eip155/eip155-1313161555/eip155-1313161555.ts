/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1313161555 = {
  "name": "Aurora Testnet",
  "shortName": "aurora-testnet",
  "chain": "NEAR",
  "rpc": [
    "https://testnet.aurora.dev/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "chainId": 1313161555,
  "networkId": 1313161555,
  "slip44": 1,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://testnet.aurorascan.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain