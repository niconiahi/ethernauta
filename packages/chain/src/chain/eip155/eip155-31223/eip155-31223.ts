/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_31223 = {
  "name": "CloudTx Mainnet",
  "shortName": "CLDTX",
  "chain": "CLD",
  "icon": "cloudtx",
  "rpc": [
    "https://mainnet-rpc.cloudtx.finance"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance",
  "chainId": 31223,
  "networkId": 31223,
  "explorers": [
    {
      "name": "cloudtxscan",
      "url": "https://scan.cloudtx.finance",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain