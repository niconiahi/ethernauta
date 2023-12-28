/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_226 = {
  "name": "LACHAIN Testnet",
  "shortName": "TLA",
  "chain": "TLA",
  "icon": "lachain-io",
  "rpc": [
    "https://rpc-testnet.lachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TLA",
    "symbol": "TLA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "chainId": 226,
  "networkId": 226,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan-test.lachain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain