/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12123 = {
  "name": "BRC Chain Mainnet",
  "shortName": "BRC",
  "chain": "BRC",
  "icon": "brcchain",
  "rpc": [
    "https://rpc.brcchain.io"
  ],
  "faucets": [
    "https://faucet.brcchain.io"
  ],
  "nativeCurrency": {
    "name": "BRC Chain mainnet native token",
    "symbol": "BRC",
    "decimals": 18
  },
  "infoURL": "https://bridge.brcchain.io",
  "chainId": 12123,
  "networkId": 12123,
  "explorers": [
    {
      "name": "BRC Chain Explorer",
      "url": "https://scan.brcchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain