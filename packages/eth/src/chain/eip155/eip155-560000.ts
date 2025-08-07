/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_560000 = {
  "name": "Hetu Testnet",
  "shortName": "HETU",
  "chain": "HETU",
  "rpc": [
    "https://rpc.testchainv1.hetuscan.com"
  ],
  "faucets": [
    "https:/testchainv1.hetuscan.com"
  ],
  "nativeCurrency": {
    "name": "tETH",
    "symbol": "tETH",
    "decimals": 18
  },
  "infoURL": "https://hetu.org",
  "chainId": 560000,
  "networkId": 560000,
  "explorers": [
    {
      "name": "Hetu Testnet Scan",
      "url": "https://testchainv1.hetuscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain