/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4460 = {
  "name": "Orderly Sepolia Testnet",
  "shortName": "orderlyl2",
  "chain": "ETH",
  "icon": "orderlyTestnet",
  "rpc": [
    "https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "www.orderly.network",
  "chainId": 4460,
  "networkId": 4460,
  "slip44": 1,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://explorerl2new-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain