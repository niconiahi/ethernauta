/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1945 = {
  "name": "ONUS Chain Testnet",
  "shortName": "onus-testnet",
  "title": "ONUS Chain Testnet",
  "chain": "onus",
  "rpc": [
    "https://rpc-testnet.onuschain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "chainId": 1945,
  "networkId": 1945,
  "slip44": 1,
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain