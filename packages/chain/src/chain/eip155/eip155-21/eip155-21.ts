/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_21 = {
  "name": "Elastos Smart Chain Testnet",
  "shortName": "esct",
  "chain": "ETH",
  "rpc": [
    "https://api-testnet.elastos.io/eth"
  ],
  "faucets": [
    "https://esc-faucet.elastos.io/"
  ],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "chainId": 21,
  "networkId": 21,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc-testnet.elastos.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain