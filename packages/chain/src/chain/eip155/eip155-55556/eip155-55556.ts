/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_55556 = {
  "name": "REI Chain Testnet",
  "shortName": "trei",
  "chain": "REI",
  "icon": "reichain",
  "rpc": [
    "https://rei-testnet-rpc.moonrhythm.io"
  ],
  "faucets": [
    "http://kururu.finance/faucet?chainId=55556"
  ],
  "nativeCurrency": {
    "name": "tRei",
    "symbol": "tREI",
    "decimals": 18
  },
  "infoURL": "https://reichain.io",
  "chainId": 55556,
  "networkId": 55556,
  "slip44": 1,
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://testnet.reiscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain