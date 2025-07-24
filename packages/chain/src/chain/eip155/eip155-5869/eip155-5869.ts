/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5869 = {
  "name": "Wegochain Rubidium Mainnet",
  "shortName": "rbd",
  "chain": "RBD",
  "rpc": [
    "https://proxy.wegochain.io",
    "http://wallet.wegochain.io:7764"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rubid",
    "symbol": "RBD",
    "decimals": 18
  },
  "infoURL": "https://www.wegochain.io",
  "chainId": 5869,
  "networkId": 5869,
  "explorers": [
    {
      "name": "wegoscan2",
      "url": "https://scan2.wegochain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain