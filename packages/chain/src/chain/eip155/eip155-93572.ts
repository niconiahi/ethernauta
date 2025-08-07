/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_93572 = {
  "name": "LiquidLayer Testnet",
  "shortName": "tLILA",
  "chain": "LILA",
  "icon": "lila",
  "rpc": [
    "https://testnet.liquidlayer.network"
  ],
  "faucets": [
    "https://claim.liquidlayer.network"
  ],
  "nativeCurrency": {
    "name": "LiquidLayer Testnet",
    "symbol": "LILA",
    "decimals": 18
  },
  "infoURL": "https://testnet-scan.liquidlayer.network",
  "chainId": 93572,
  "networkId": 93572,
  "explorers": [
    {
      "name": "LiquidLayer Testnet Explorer",
      "url": "https://testnet-scan.liquidlayer.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain