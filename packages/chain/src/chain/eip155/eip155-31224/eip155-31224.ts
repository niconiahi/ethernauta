/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_31224 = {
  "name": "CloudTx Testnet",
  "shortName": "CLD",
  "chain": "CloudTx",
  "icon": "cloudtx",
  "rpc": [
    "https://testnet-rpc.cloudtx.finance"
  ],
  "faucets": [
    "https://faucet.cloudtx.finance"
  ],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance/",
  "chainId": 31224,
  "networkId": 31224,
  "slip44": 1,
  "explorers": [
    {
      "name": "cloudtxexplorer",
      "url": "https://explorer.cloudtx.finance",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain