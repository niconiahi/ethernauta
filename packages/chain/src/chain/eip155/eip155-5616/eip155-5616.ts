/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5616 = {
  "name": "Arcturus Chain Testnet",
  "shortName": "ARCT",
  "chain": "ARCTURUS",
  "rpc": [
    "http://185.99.196.3:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Test Arct",
    "symbol": "tARCT",
    "decimals": 18
  },
  "infoURL": "https://arcturuschain.io",
  "chainId": 5616,
  "networkId": 5616,
  "slip44": 1
} satisfies Chain