/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_799 = {
  "name": "Rupaya Testnet",
  "shortName": "RupayaTestnet",
  "chain": "Rupaya Testnet",
  "rpc": [
    "https://rpc.testnet.rupaya.io"
  ],
  "faucets": [
    "https://faucet.testnet.rupaya.io"
  ],
  "nativeCurrency": {
    "name": "Test Rupaya",
    "symbol": "TRUPX",
    "decimals": 18
  },
  "infoURL": "https://www.rupaya.io",
  "chainId": 799,
  "networkId": 799,
  "slip44": 1,
  "explorers": [
    {
      "name": "rupayascan",
      "url": "https://scan.testnet.rupaya.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain