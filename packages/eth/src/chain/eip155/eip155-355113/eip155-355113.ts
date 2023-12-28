/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_355113 = {
  "name": "Bitfinity Network Testnet",
  "shortName": "Bitfinity",
  "chain": "BFT",
  "rpc": [
    "https://testnet.bitfinity.network"
  ],
  "faucets": [
    "https://bitfinity.network/faucet"
  ],
  "nativeCurrency": {
    "name": "BITFINITY",
    "symbol": "BFT",
    "decimals": 18
  },
  "infoURL": "https://bitfinity.network",
  "chainId": 355113,
  "networkId": 355113,
  "slip44": 1,
  "explorers": [
    {
      "name": "Bitfinity Block Explorer",
      "url": "https://explorer.bitfinity.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain