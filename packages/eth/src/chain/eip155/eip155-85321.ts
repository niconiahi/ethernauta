/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_85321 = {
  "name": "GDPR Testnet",
  "shortName": "gdpr-testnet",
  "chain": "GDPR",
  "rpc": [
    "https://rpc.testnet.gdprchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GDPR",
    "symbol": "GDPR",
    "decimals": 18
  },
  "infoURL": "https://explorer.testnet.gdprchain.com",
  "chainId": 85321,
  "networkId": 85321,
  "explorers": [
    {
      "name": "GDPR Testnet Explorer (Blockscout)",
      "url": "https://explorer.testnet.gdprchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain