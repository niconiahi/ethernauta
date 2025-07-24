/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_751230 = {
  "name": "Bear Network Chain Testnet",
  "shortName": "BRNKCTEST",
  "chain": "BRNKCTEST",
  "icon": "brnkc",
  "rpc": [
    "https://brnkc-test.bearnetwork.net"
  ],
  "faucets": [
    "https://faucet.bearnetwork.net"
  ],
  "nativeCurrency": {
    "name": "Bear Network Chain Testnet Token",
    "symbol": "tBRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "chainId": 751230,
  "networkId": 751230,
  "slip44": 1,
  "explorers": [
    {
      "name": "brnktestscan",
      "url": "https://brnktest-scan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain