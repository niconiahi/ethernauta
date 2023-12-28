/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_512512 = {
  "name": "CMP-Testnet",
  "shortName": "cmp",
  "chain": "CMP",
  "rpc": [
    "https://galaxy.block.caduceus.foundation",
    "wss://galaxy.block.caduceus.foundation"
  ],
  "faucets": [
    "https://dev.caduceus.foundation/testNetwork"
  ],
  "nativeCurrency": {
    "name": "Caduceus Testnet Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "infoURL": "https://caduceus.foundation/",
  "chainId": 512512,
  "networkId": 512512,
  "slip44": 1,
  "explorers": [
    {
      "name": "Galaxy Scan",
      "url": "https://galaxy.scan.caduceus.foundation",
      "standard": "none"
    }
  ]
} satisfies Chain